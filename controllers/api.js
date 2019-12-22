const puppeteer = require('puppeteer')

const wizardSteps = [
    {
        action: login
    },
    {
        parent: '.wizard-content div.col.l3.m4.s12:nth-of-type(2)',
        selector: 'li[data-content="acura"]',
        action: clickAction
    },
    {
        parent: '.wizard-content div.col.l3.m4.s12:nth-of-type(3)',
        selector: 'li[data-content="ilx"]',
        action: clickAction
    },
    {
        parent: '.wizard-content div.col.l3.m4.s12:nth-of-type(4)',
        selector: 'li[data-content="sedan"]',
        action: clickAction
    },
    {
        parent: '.wizard-content div.col.l3.m4.s12:nth-of-type(5)',
        selector: 'li[data-content="2018"]',
        action: clickAction
    },
    {
        parent: '.wizard-content div.col.l3.m4.s12:nth-of-type(6)',
        selector: 'li[data-content="nuevo leon"]',
        action: clickAction
    },
    {
        parent: '.wizard-content div.col.l3.m4.s12:nth-of-type(7)',
        selector: 'li[data-content="monterrey"]',
        action: clickAction
    },
    {
        parent: '.wizard-content div.col.l3.m4.s12:nth-of-type(8)',
        selector: '#input_recorrido',
        value: '20000',
        action: inputAction
    },
    {
        parent: '.wizard-content div.col.l3.m4.s12',
        selector: '#input_precio',
        action: inputAction,
        prop: 'price'
    },
    {
        selector: '.next-button',
        action: navigate
    },
    {
        parent: '.wizard-content div.col.l3.m4.s12',
        selector: '#input_text_area_review',
        action: inputAction,
        prop: 'desc'
    },
    {
        selector: '#Uploader',
        action: async function(page){
            let input = await page.$(this.selector)
            let paths = [
                process.cwd()+'/assets/pic1.jpg',
                process.cwd()+'/assets/pic2.jpeg',
                process.cwd()+'/assets/pic3.jpg'
            ]
            for(let path of paths){
                await input.uploadFile(path)
                await page.waitFor(5000)
            }
            return await page.waitFor(200)
        }
    },
    {
        selector: '.next-button:nth-of-type(2)',
        action: navigate
    },
    {
        selector: '#cancelButton',
        action: async function (page){
            return await page.click(this.selector)
        }
    }
]
exports.create = async (req, res) => {
    try {
        const browser = await puppeteer.launch({defaultViewport: {width: 1024, height: 920}})
        const page = await browser.newPage()
        for(let [index, step] of wizardSteps.entries()){
            await step.action(page, req)
            if(wizardSteps[index+1])
                await page.waitFor(wizardSteps[index+1].selector)
        }
        
        let screenshot = await page.screenshot({
            encoding: 'base64',
            type: 'jpeg'
        })
        await browser.close()
        return res.status(200).send(screenshot)
    } catch (error) {
        return res.status(500).json(error.stack)
    }
}
async function login(page){
    let form = {
        form: '#formLogin',
        user: '#emailSignIn',
        password: '#passwordSignIn',
        submit: '#btnLogin'
    }
    await page.goto('https://seminuevos.com')
    await page.click('#loginBtn')

    await page.click(form.user)
    await page.keyboard.type('serversidebrowser@yopmail.com')

    await page.click(form.password)
    await page.keyboard.type('22wT7Pt8.vsJaAw')
    
    await page.click(form.submit)

    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    await page.goto('https://www.seminuevos.com/wizard?f_dealer_id=-1')
    await page.waitFor(2000)
}
async function clickAction(page) {
    await page.click(this.parent)
    return await page.click(this.selector)
}
async function inputAction(page, req) {
    await page.click(this.selector)
    if(this.prop){
        return await page.type(this.selector, req.body[this.prop])
    } else {
        return await page.type(this.selector,this.value)
    }
}
async function navigate(page){
    await page.click(this.selector)
    return await page.waitForNavigation({ waitUntil: 'networkidle0' })
}