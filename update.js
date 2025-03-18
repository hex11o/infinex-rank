import axios from "axios"
import fs from 'fs';
import currentRound from "./config.js"

const instance = axios.create({
  baseURL: 'https://api.app.infinex.xyz/',
  headers: {
    'Content-Type': 'application/json',
    cookie: "intercom-id-aowbswdv=f605f99c-12b7-4e9d-b6dd-367d2787eacf; intercom-session-aowbswdv=; intercom-device-id-aowbswdv=894b3f49-dd73-401e-bdfa-a936f1fb9286; infinex_session=Fe26.2**5089179d2ba5c69df1a5304b0fc6a812f1a8e7ec62e90fc181495aad555bcf3b*HDEoo8WVsThLu2nEbGRdkw*5C_rWPoizLHq84wcF3XA29K8VLW9elDd2gr3Mu_MyMtCLi4d34YPMk_rzbVj9B-tfFzfO40L3iHzaYL5G11QE-2Bv6qz2Zgm2N0Q7_gkvX-M6HDi11qbo7IlkbiNjz2R6-EbRO6iIBeGOoL9V2tmE3y69cL8vaWyE5Sgf1iCyGJScPTbXJjMbAULrYD9lxPh*1742352313655*6ffe24435ff10bd1aba4e4375e079bc6d813d5fa1274291ac33c142a9fdc66a5*So4UgHv4CcNlu9VXBcsgCruPWba9SuxRpT61_0ZqQQg; infinex_session_key=Fe26.2**3af687f05496a14681f8debec80921fa6d960508350ba2c1e584d69f7a9b0735*6L1kTGRu_3K_V30cAVph_A*toIrJppOWJz6WOCo2mQmFGTkc8Vuvoj3Ckw656MmmrE_a91y0gDXy7Xwc3m8f1gbhwhHQiisC9ztkqd-pvj3eb6vqh3qSmf0c6h5Cjmspux3cwr-4wAtUujkIiBms8PbcVqy054_S6K2TLWkf11RZiuUu910cEhbF-e-_yawXRFZQAdsBjVkw70GaZwvyUGI_HI3Zw75K2HsQLuVCWZe0Q_ER6lqAR-qKEr41oaKz-HA75YdhRPKl5O6rs7p4r17ZogBLchE9Ny2IlJaGylLEqBy5wkNbL3kHc9E2mzLdne9qYzNXrQJSlCWYbLFrPly*1742352316190*66497013970e68a90ac7850bc792a57134866d05c1f446912e40a01ea4bedf75*vyuT4DQmFUSCo5UZun5b1k5hcUf5MULmH-_sY5QrK3w; ph_phc_W4lu1hjnp81AqC6n6iFUjINiz4SYp0ZEsIhwTOYWiMX_posthog=%7B%22distinct_id%22%3A%22d6fbfd5e-1f0b-44c1-b4fa-752c17ea20b2%22%2C%22%24sesid%22%3A%5B1742265955470%2C%220195a723-ad11-7184-b913-f8802640c603%22%2C1742265888017%5D%2C%22%24epp%22%3Atrue%7D"
    , baggage: "sentry-environment=prod,sentry-release=84c48e3f21f3332abfba0d70422418fe183dc421,sentry-public_key=36bf08dbb646a1eb6dd5fd9dee3ee735,sentry-trace_id=428b313a0cbd4313ae51e8bca6fa7934"
    , origin: "https://app.infinex.xyz"
    , "sentry-trace": "428b313a0cbd4313ae51e8bca6fa7934-8ccce2887e751bce",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
  }
})

const dataRound = 2 // 获取的已结束轮数
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
