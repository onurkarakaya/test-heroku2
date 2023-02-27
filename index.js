require('dotenv').config();
const twitterHelper = require('./services/twitterHelper');
const earthquake = require('./services/earthquake');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

let scannerEnable = false;




app.listen(port, async () => {
    console.log("Server is running on port: " + port);  
    Scanner2();
});

app.get('/status', (req, res) => {
    if (scannerEnable) {
        res.status(200).json({
            message: 'Scanner is running'
        });
    } else {
        res.status(200).json({
            message: 'Scanner is NOT running'
        });
    }
});

app.get('/start', (req, res) => {    
    scannerEnable = true;
    res.send('ok');
});

app.get('/stop', (req, res) => {
    scannerEnable = false;
    res.send('ok');
});

//Scanner2();

const Scanner2 = async () => {

    try {

        await twitterHelper.loginAccount(process.env.accountUsername, process.env.email, process.env.password);
        console.log('giris yapildi');

        let oldBuffer = [];   
    
        while (true) {

            //console.log('while baslangici');
            if (scannerEnable) {
                //console.log('scanner enable if ici');
                const json =  await earthquake();
                //console.log(json);
                if (oldBuffer.length !== 0) {

                    //console.log('old buf len buyuk 0 ici');
                    let newValues = json.result.filter(r => !oldBuffer.some(o => o.title.includes(r.title) && o.date.includes(r.date)));
                    //console.log('filter sonrasi');
                    if (newValues.length > 0) {
                        console.log('Found: ' + newValues.length);
                
                        for (const v of newValues) {
                            const content = `Tarih: ${v.date}\nYer: ${v.title}\nEnlem: ${v.lat}\nBoylam: ${v.lng}\nBuyukluk: ${v.mag}\nDerinlik: ${v.depth}km`;
                            await twitterHelper.postTweet(content);
                            console.log('Tweet gonderildi: \n' + content); 
                        }                    

                    }else{
                        console.log('Not found.');
                    }
                }

                oldBuffer = json.result; 
                //console.log('oldbuffer json.result esitlendi');  
            }

            //console.log('delay basi');
            await delay(10000);    
            //console.log('delay sonu');          
        }

    } catch (error) {
        console.log(error);
        await twitterHelper.browserClose();
        scannerEnable = false;
    }
    
}



const scanner3 = async () => {
    try {
        await twitterHelper.loginAccount(process.env.accountUsername, process.env.email, process.env.password);
    } catch (error) {
        console.log(error);
    }
    
}


//Scanner();

async function Scanner() {

    await twitterHelper.loginAccount('Fatihak63456551', 'sifirikinciel129@gmail.com', 'Cureagd129*');

    let oldBufferArray = [];   

    setInterval(async () => {
        
        const json =  await earthquake();

        if (oldBufferArray.length !== 0) {

            let newValues = json.result.filter(r => !oldBufferArray.some(o => o.title.includes(r.title) && o.date.includes(r.date)));
            if (newValues.length > 0) {
                console.log('Found: ' + newValues.length);
                
                for (const v of newValues) {
                    const content = `Tarih: ${v.date}\nYer: ${v.title}\nEnlem: ${v.lat}\nBoylam: ${v.lng}\nBuyukluk: ${v.mag}\nDerinlik: ${v.depth}km`;
                    await twitterHelper.postTweet(content);
                    console.log('Tweet gonderildi: \n' + content); 
                }
            }else{
                console.log('Not found.');
            }
        }

        oldBufferArray = json.result;
        
    }, 10000);
}

function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time)
    });
  }

// await earthquake()
//             .then(async (json) => {
                
//                 if (oldBufferArray.length !== 0) {

//                     let newValues = json.result.filter(r => !oldBufferArray.some(o => o.title.includes(r.title) && o.date.includes(r.date)));

//                     if (newValues.length > 0) {
//                         console.log('Found: ' + newValues.length);
                      
//                         for (const v of newValues) {
//                             const content = `Tarih: ${v.date}\nYer: ${v.title}\nEnlem: ${v.lat}\nBoylam: ${v.lng}\nBuyukluk: ${v.mag}\nDerinlik: ${v.depth}km`;

//                             await twitterHelper.postTweet(content);
//                             console.log('Tweet gonderildi: \n' + content); 
//                         }

//                     }else{
//                         console.log('Not found.');
//                     }
//                 }

//                 oldBufferArray = json.result;
//             })
//             .catch((error) => {
//                 console.log(error);
//             })

