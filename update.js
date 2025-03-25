import axios from "axios"
import fs from 'fs';
import currentRound from "./config.js"

const instance = axios.create({
  baseURL: 'https://api.app.infinex.xyz/',
  headers: {
    'Content-Type': 'application/json',
    cookie: "intercom-id-aowbswdv=f605f99c-12b7-4e9d-b6dd-367d2787eacf; intercom-device-id-aowbswdv=894b3f49-dd73-401e-bdfa-a936f1fb9286; infinex_session=Fe26.2**e8d535deeca765de5b890373a49466f0bd92f1c6ddb195f994d7dbb94b705183*NLeteh6uo62EvhHYrtpJOw*A4loKx_AdtUWHUG6BYnDDv2YA0RRUdNOaxiC4GyjnsjMqCbr5O1eyG0UAaYRAfEXAu5TEQxRdRNUesz6qZfxHDlGkSrhQWtP7RG43CbfvquoS21az-p9DxaWZf18t4eO2mHOyCkM3mLCHGzWg7DYoF5jtBfRYPtCyBERody0w4kwlOP8KxtdqOCT_5XS4NpyejmxMfh9dgI5YcDaBY-kgNSgjEiuKK9mxU1d7jN8d0Y*1742963976130*7333bfc49eece3ad3f65b4b4d9a9aa975a73c0ead9626e28b1f015d6efe82e72*UuNpwcAMispMWtyNMuX7P0ln457WHiwu7GeCVWcd3ZE; infinex_session_key=Fe26.2**d633cf1d951c90197cb464115de49e9bfdc90c991ab6ad59ab1530949a28f4b5*EZqo66ME1HyBVt47ZoWt1A*AUPe5XDxFb4pUaBK8wJkoi2rhSnCc9FyaaXOHh2QH5sjgosYdSpFcAiou1obfijs0jk3Bp4wQnu-F85l-EJCiykueb4NfPyJLfKgh5tl4KIjMgRsvkhpDTLhc5ymwoYiOpM8l34cYVofuNDmVGQVFzjoQqzJ1mHUWH10Azb2TM43BJUtteId71ZI9MoHCaIZkm8EHbJ4cYWctxfqWssNWh4_yuGryejQXEdE705XRQYQUQN8-sA7AeVMHMcpoYtWeU-5Jo6jdk2PGRijWIs3HiCYuA6KsMNqBAFcNt1XlhS-T-p_J3xUjDr_cR_Wwp-M*1742963978335*33bc1b45fbd0cb16214c0a1bf9e665c6c1adc76b5a36d9ae081afb34ea587b20*M2vshOTjttaEpg-vCRs1ZBNQUtzTNJ7tusZIUBW8fgc; ph_phc_W4lu1hjnp81AqC6n6iFUjINiz4SYp0ZEsIhwTOYWiMX_posthog=%7B%22distinct_id%22%3A%22d6fbfd5e-1f0b-44c1-b4fa-752c17ea20b2%22%2C%22%24sesid%22%3A%5B1742877688394%2C%220195cb98-d5d4-7a74-b80d-df95e7745641%22%2C1742877545940%5D%2C%22%24epp%22%3Atrue%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22https%3A%2F%2Finfinex.xyz%2F%22%2C%22u%22%3A%22https%3A%2F%2Fapp.infinex.xyz%2Fplay%2Fbullrun%22%7D%7D"
    , baggage: 
    "sentry-environment=prod,sentry-release=2d9951dd2436af55c0bf091f05a1c7f96a3bc7e1,sentry-public_key=36bf08dbb646a1eb6dd5fd9dee3ee735,sentry-trace_id=d4c687f8e1684324bd1d104e6b1062af"
    , origin: "https://app.infinex.xyz"
    , "sentry-trace": "d4c687f8e1684324bd1d104e6b1062af-aeb077dc9a7b6c4a",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
  }
})

const dataRound = 6 // 获取的已结束轮数
const filePath = "./infinex.json"

let apiPath = new Array(dataRound).fill("cardrunGetRoundLeaderboard").join(",")
let input = {}

const cacheData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {};
let roundResult = cacheData

for (let i = 0; i<dataRound;i++) {
  const roundId = currentRound + 2 - i
  input[i] = { roundId }
}

await instance.get(apiPath, {
  params: {
    batch: 1,
    input: JSON.stringify(input)
  }
}).then((res) => {
  res.data.forEach((data, i) => {
    roundResult[currentRound + 2 - i] = data.result.data.leaderboard
  });
  fs.writeFileSync(filePath, JSON.stringify(roundResult, null, 2), 'utf-8');
})
