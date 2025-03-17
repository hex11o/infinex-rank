import axios from "axios"
import fs from 'fs';
import currentRound from "./config.js"

const instance = axios.create({
  baseURL: 'https://api.app.infinex.xyz/',
  headers: {
    'Content-Type': 'application/json',
    cookie: "intercom-id-aowbswdv=f605f99c-12b7-4e9d-b6dd-367d2787eacf; intercom-session-aowbswdv=; intercom-device-id-aowbswdv=894b3f49-dd73-401e-bdfa-a936f1fb9286; infinex_session=Fe26.2**c1b02f24f06a7805e5d3ff9559061d397bbe3b6df70795a3bf4071b027fa7865*tCSmEGC4YylrBp2HNLztDQ*nsq2noSI-x-miHhsrDoSdm0QqWtsHeLzBdTQxIYDXyIOU7gjOq-ulxQCgdquyCFybiihIRjUlZodAVrpFv6HypGMbwsDKoJT7gtLuLouJXY-H7h97t4CvXW90wH5VIVEl2fCIwk_ml2tk8cqe_pejvTTQRxflyiP_ki_08FKxbAajgFnh-7BCSfPgMBZmyaR*1742264535062*be1570de55b5f5d0f49831e6dfde99fb92ea721e16c231749e4d992dcd8ae848*AaqQ8eLdDT-cdAAXqHFliqjkriyKZV1ceitdaydeqL4; infinex_session_key=Fe26.2**4971ddacb9f717479a470042544e4bb3d0ffead214abeb14cd614502138b5ac3*ciCVJM7iyGvCw2PGdi1q0w*TdGANifvcWPlgPh6yotKcPU2-_dMqaPefGrOF8LfiUtQs0AfOANVWAbBhC1cm-P1kJk4cP4C6cPVwf7K_BgpWYOIwnAQR2Wxa8FobuFSzOrZRoshwMwzAhmpBv6Yi-5RbgwtRAotgAoQ-ixcn5jn-g9CQMGd_MB5JoKrAfmyo8FpgdQ3BIdd1I0PHXFF1akYKoRcavq-473TgD_4MNW4isozuO6fMiynhDLHGLgI43RVD72u45FZNDWqXNrcPoPY9Rj9V-C9QfqD7S8xuHqZS70VD9k_W9clMuUAkjIp9mXW7BC317EbejlMCTcZWN37*1742264537447*6ec646575481bf6d5a935d68ede2b995e24541ba84ef8f0b59fc7f68731e78c5*cjXV8WSBoeXfGfGedPYVCpJcxTA8EqsRyd6T4DnuUws; ph_phc_W4lu1hjnp81AqC6n6iFUjINiz4SYp0ZEsIhwTOYWiMX_posthog=%7B%22distinct_id%22%3A%22d6fbfd5e-1f0b-44c1-b4fa-752c17ea20b2%22%2C%22%24sesid%22%3A%5B1742178149106%2C%220195a1e8-3181-7033-bccf-4807a519c960%22%2C1742178103681%5D%2C%22%24epp%22%3Atrue%7D"
    , baggage: "sentry-environment=prod,sentry-release=84c48e3f21f3332abfba0d70422418fe183dc421,sentry-public_key=36bf08dbb646a1eb6dd5fd9dee3ee735,sentry-trace_id=b244d6923f7549f0ae1bd81af2873b44"
    , origin: "https://app.infinex.xyz"
    , "sentry-trace": "b244d6923f7549f0ae1bd81af2873b44-9d065bcfb377553b",
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
