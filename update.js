import axios from "axios"
import fs from 'fs';
import currentRound from "./config.js"

const instance = axios.create({
  baseURL: 'https://api.app.infinex.xyz/',
  headers: {
    'Content-Type': 'application/json',
    cookie: "intercom-id-aowbswdv=f605f99c-12b7-4e9d-b6dd-367d2787eacf; intercom-device-id-aowbswdv=894b3f49-dd73-401e-bdfa-a936f1fb9286; infinex_session=Fe26.2**09c9331d3d49154016a9b2ab12de8041e8d0973935362a6828a3a3adbcbff210*uBtiUJwmOtw4fk001HDAVw*LTmkIld4f8xhnZQ0tlRtIjInjkkt9_4OwLJWAM-he8ocb3c6Tu0cvtIkKil9a4SUxExHKUFN4YZYYF_nIagbjxBLZFqSJkWpP3r0zdhVrP1-2zivgACzWOWubDR1AVagsWLRwJmo8wNwArO_5O5Py3xZcdKCW07_Xmyf0wJmQTHvM9lWkfkHa2z_TRCoiFNElcGZnaNXhZ9_onOl_9ZpFkgJmodTnfrxNfryqtcXvbg*1743057695093*c7b593aa4a6eeefea6bc4c99451dd0fe09a1af18f84674346f84ebd425fd1850*NAlzBoIxxqC5TIVoFMGhyGr2C7MKYYFQkTExPFAxpkk; infinex_session_key=Fe26.2**87b131ca6d6fa9d51f7152f781346210e79c95494f4cd113364eefa99e1c7d1c*qg6EaZKxOO9TcmvgFeWmSg*hlnGDZtucnT-_vK0SSyByhf-Ic0qWLLlqQNtA_ToPCwAP2Ks5ZAE-qZSn6ZmTiT3QtRLv42VKX8144N6CD7q0daQ9YY3J4a4zlzC48_8avcEEs40ESMOQHgXSLXde40O-6J4lhXz_K_UdpcQDWxxxJtgJhGUhzTQTO0lPGOFP5b1lrWKS3nANn0z5Fa4s-9u3Rgjxo9mujsI7BqKMZevxbzsv0yrXmH51pFTLL3tECM1yGh_i9-qmuP-gAacezaHTNp1fyvuW1g3cSGfFQxaUUPJWst7IOAXL4GKnH-PNd7hSy4I5wCcfG88Hmj6HlNr*1743057697535*f9571be3230b6fa7a8d5f55051a1fa114bb98871747e3463234ec134b95d9e2e*qOL4oH7w3G1aLXVKVsRKwI7tuwKzNYK0me1odKtp7QA; ph_phc_W4lu1hjnp81AqC6n6iFUjINiz4SYp0ZEsIhwTOYWiMX_posthog=%7B%22distinct_id%22%3A%22d6fbfd5e-1f0b-44c1-b4fa-752c17ea20b2%22%2C%22%24sesid%22%3A%5B1743049693425%2C%220195d5da-8b58-7846-9088-c7aebcf9ea6c%22%2C1743049624408%5D%2C%22%24epp%22%3Atrue%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22https%3A%2F%2Finfinex.xyz%2F%22%2C%22u%22%3A%22https%3A%2F%2Fapp.infinex.xyz%2Fplay%2Fbullrun%22%7D%7D"
    , baggage: 
    "sentry-environment=prod,sentry-release=4dbefaa44d6421d5f38a66eac441403254003f0d,sentry-public_key=36bf08dbb646a1eb6dd5fd9dee3ee735,sentry-trace_id=a7fc10a4cf2b4ebe8adbe701a4ffa793"
    , origin: "https://app.infinex.xyz"
    , "sentry-trace": "a7fc10a4cf2b4ebe8adbe701a4ffa793-bb855504495755a6",
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
