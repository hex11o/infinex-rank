import axios from "axios"
import fs from 'fs';
import currentRound from "./config.js"

const instance = axios.create({
  baseURL: 'https://api.app.infinex.xyz/',
  headers: {
    'Content-Type': 'application/json',
    cookie: "intercom-id-aowbswdv=d68fcbd2-44e2-4a52-a5be-b40f9e078e9f; intercom-device-id-aowbswdv=b7a626e8-76e7-4116-b28f-7419ffe7ac05; _ga=GA1.1.606478956.1730253161; _ga_1FH06HRQPY=GS1.1.1730253160.1.1.1730253321.0.0.0; infinex_session=Fe26.2**9b37a27dcf2c68710b8640bf806d6125581a39ba5eff2996c299bb8fa24d9e67*V18kBtfeg348R5ZeDbv9Aw*rz0MLPDtDas3ij9AD0R6BgOgxfHfrAKNO_hs8kPxsPQd8KH__kR5z78-JvullAiSYBekW_xunE5mdDc4OVcGN1woOOAH-9-RAj8C32ZDwyxj5MeaRPMurOxBwzAhXQU7oJjer-aQOyqmRoTfOyybp7I5fCN5899j4PWJqoJ2ofpDkGVuagGMJF_oOt5g23wCRHXkTe_rFf1CGLhDxvn8VOuyvi6uKFF0phBORofUWHo*1744520831819*a8ab0d7bb634a1184895f75b229a7b01758aea4d26be0631b7feaaf8306e93d1*phCW-QTXRVD7DeSw5bhtcqDlWWFcUXNHlEoWiIL99f4; infinex_session_key=Fe26.2**52c691ce66baf8ef82bb58a0fcd6dddc45a90c37170e030ee9db08151f1d216f*lTGwglyQh5MwTtg09EHDOg*hF6Vr9NOSPsAMCYp60-_kY0_-6o8sw0f6lKY4_qEj6e-7Z7lTQvynKYnRlJ6yc6zwN-mpDamFEDBGB2wVefKjA-5JPMtHIvrKfvn8izQHSlv4kF34mGTncx0S7FsMZHG-ImFyjK26OGuNcujzC0BoBSD-ZNXDB7U3l_rEUNxv6hyQqydlXfPBi4WeiPC4UAIB3CthMoHYsfo6ow6q8ejfBzpIsIPWCyoSd8xG_l98IQOgZrcEW8bdvwQMVSDrlSlPs5BtdFCvGJgct-8If0BK-DUtXqjaQj3zXZBb1bK82-qySGQ9CMsp4n_CORTLM-G*1744520834052*17ed330bcccb61dff508aa6c5669c559d0f1288d95f9ce4c5569d634696ae7cb*s-pQTUIdssJmnEFFyaPtuYNT-eRHzrb_iw4iM4tACyI; ph_phc_W4lu1hjnp81AqC6n6iFUjINiz4SYp0ZEsIhwTOYWiMX_posthog=%7B%22distinct_id%22%3A%22d6fbfd5e-1f0b-44c1-b4fa-752c17ea20b2%22%2C%22%24sesid%22%3A%5B1744434440258%2C%2201962864-e0c0-78f5-8ddc-7ee636dec0fb%22%2C1744434421952%5D%2C%22%24epp%22%3Atrue%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22%24direct%22%2C%22u%22%3A%22https%3A%2F%2Fapp.infinex.xyz%2F%22%7D%7D"
    , baggage: 
    "sentry-environment=prod,sentry-release=06ec974c6da5991c8d303901587eca6112af8bae,sentry-public_key=36bf08dbb646a1eb6dd5fd9dee3ee735,sentry-trace_id=ff86cb4bdf6a4963bb895c73aabb6238"
    , origin: "https://app.infinex.xyz"
    , "sentry-trace": "ff86cb4bdf6a4963bb895c73aabb6238-93cb96791d205b58",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
  }
})

const dataRound = 10 // 获取的已结束轮数
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
