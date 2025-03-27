<script setup>
import { reactive, ref, watch } from "vue"
import data from "../infinex.json"
import currentRound from "../config.js"

let userResult = reactive({})
let search = ref('')
let searchResults = ref([])

const BULL_START_ROUND_ID = 39
const LARGE_RANGE_ROUND_ID = 138

Object.entries(data).forEach(([roundId, leaderboard]) => {
  leaderboard.forEach(item => {
    const { username, position } = item;
    const userData = userResult[username]
    let bull = 0
    let id = Number(roundId)
    if (id >= LARGE_RANGE_ROUND_ID) {
      bull = Math.floor(85581 * Math.pow(position, -0.91494))
    } else if (id >= BULL_START_ROUND_ID) {
      bull = Math.floor(100310 * Math.pow(position, -0.91494))
    }
    let roundData = {...item, bull, roundId}
    if (userData) {
      userData.push(roundData)
    } else {
      userResult[username] = [roundData]
    }
  })
})

// 获取所有人的总分，并进行排名
let bullResult = Object.entries(userResult).map(([name, list]) => {
  const bullList = Object.values(list).map(({ bull }) => bull)
  const sortLb = list.sort((a, b) => a.position - b.position)
  let positions = {}
  sortLb.forEach((item) => {
    let { position } = item
    if (!positions[position]) {
      positions[position] = [1, [item]]
    } else {
      positions[position][0] += 1
      positions[position][1].push(item)
    }
  })

  let bull = 0
  bullList.forEach(i => bull += i)
  return {name, bull, positions}
}).sort((a, b) => b.bull - a.bull).map((item, i) => {
  return {...item, rank: i}
})

watch(search, (val) => {
  if (val.length < 3) {
    searchResults = []
  } else {
    searchResults = bullResult.filter(({ name }) => {
      return name.toLocaleLowerCase().includes(val.toLocaleLowerCase())
    })
  }
})

let top5 = bullResult.slice(0, 5)
let top100 = bullResult.slice(5, 100)

function splitArrayIntoFiveParts(arr) {
  const length = arr.length;
  const partSize = Math.ceil(length / 5);
  const result = [];

  for (let i = 0; i < 5; i++) {
    const start = i * partSize;
    const end = start + partSize;
    result.push(arr.slice(start, end));
  }

  return result;
}

const result = splitArrayIntoFiveParts(top100);

defineExpose({
  search,
  searchResults
})

</script>

<template>
  <div>Data as of Round {{ currentRound }}</div>
  <div>数据截止于：{{ currentRound }}轮</div>
  <div class="notify">
    <img src="./assets/info.svg" alt="">
    <div class="content">
      <div>Only players who have won the top 20 places are counted, Bulls obtained after 20th place are not included in the statistics.</div>

      <div>仅统计获得过前20名的玩家，20名后所获得的bull不在统计范围内。</div>
    </div>
  </div>
  <br/>

  <div class="search-container">
    <div class="input-wrapper">
      <input
        type="text"
        id="searchInput"
        placeholder="Search..."
        autocomplete="off"
        v-model="search"
      />
      <button  class="clear-button" @click="search = ''">×</button>
    </div>
    <div  class="dropdown" v-if="search.length || searchResults.length">
      <div v-if="searchResults.length">
        <div v-for="user in searchResults" class="dropdown-item">
          <div class="rank" style="width: 50px; text-align: left; margin-right: 10px;">#{{ user.rank + 1 }}</div>
          <div class="username" style="width: 150px; text-align: left;">{{ user.name }}</div>
          <div class="bull" style="width: 120px; text-align: left;">Bull: {{ user.bull }}</div>
          <div class="history" style="text-align: left;">
            Rank history:
            <span v-for="item in Object.entries(user.positions)">
              [#{{ item[0] }}]×{{ item[1][0] }}
            </span>
          </div>
        </div>
      </div>
      <div v-else style="line-height: 50px;">No result, play more.</div>
    </div>
  </div>

  <div class="top5-wrapper">
    <div v-for="(user, i) in top5" :key="i" class="card top5" :style="{transform: `rotate(${6.25*(i-2)}deg) translate(0, ${i == 0 ? '54px' : i == 1 ? '14px' : i ==3 ? '14px' : i== 4 ? '54px' : '0'})`}">
      <div class="content">
        <div class="rank">#{{ i+1 }}</div>
        <div class="username">{{ user.name }}</div>
        <div class="bull">Bulls: {{ user.bull }}</div>
      </div>
    </div>
  </div>
  <div style="margin-top: 20px; font-size: 18px;">Total top20 player: {{ bullResult.length }}</div>
  <div style="margin-top: 20px; font-size: 18px;">Last place bull: {{ bullResult[bullResult.length -1].bull }}</div>
  <div class="table-wrapper" style="margin-top: 30px;">
    <table class="table" v-for="(list, i) in result" style="color: rgb(176, 180, 186);">
      <colgroup>
        <col style="width: 25%;">
        <col style="width: 50%;">
        <col style="width: 25%;">
      </colgroup>
      <thead>
        <tr>
          <td>Rank</td>
          <td>Player</td>
          <td>Bulls</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, j) in list">
          <td>#{{ user.rank + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.bull }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <br>
  <a href="https://x.com/hex11o" target="_blank">By @hex11o with ♥️</a>
</template>

<style scoped>
.notify {
  display: flex;
  margin: 10px auto;
  column-gap: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  width: 900px;
  background-color: rgb(32, 35, 39);
  color: orange;
}
.notify img {
  width: 26px;
  height: 26px;
}
.notify .content {
  text-align: left;
}

.top5-wrapper {
  display: flex;
  justify-content: space-between;
  column-gap: 3rem;
}
.card {
  width: 180px;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgb(32, 35, 60);
  color: #FFFFFF;
  border-radius: 10px;
}

.card:hover {
  box-shadow: 
    0 0 13px 4px rgba(255,255,255,0.3),
    0 5px 10px 0px rgba(0, 0, 0, 0.7);
}

.top5:first-child {
  background: linear-gradient(45deg, #ff5100, #e46f21, #fd5101);
}
.top5:nth-child(2) {
  background: linear-gradient(45deg, #f7f7f7, #A8A8A8, #f5f5f5);
}
.top5:nth-child(3) {
  background: linear-gradient(45deg, #CD7F32, #8B4513, #CD7F32);
}

.table-wrapper {
  display: flex;
  justify-content: space-between;
  column-gap: 2rem;
}

.table {
  border-collapse: collapse; /* 合并边框 */
}
th, td {
  padding: 2px 8px;
  border-color: rgba(221, 234, 248, 0.08);
  border-top: 1px solid rgba(221, 234, 248, 0.08); /* 边框样式 */
  border-bottom: 1px solid rgba(221, 234, 248, 0.08); /* 边框样式 */
}

.search-container {
  position: relative;
  z-index: 1;
  margin-bottom: 40px;
}
.input-wrapper {
  position: relative;
  width: 920px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 清空按钮样式 */
.clear-button {
  position: absolute;
  right: 10px;
  background: none;
  margin-left: 0;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
}

.clear-button:hover {
  color: #ffffff;
}


/* 输入框样式 */
#searchInput {
  width: 900px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #444;
  border-radius: 5px;
  background-color: #333;
  color: #ffffff;
  outline: none;
}

#searchInput::placeholder {
  color: #888;
}

/* 下拉结果框 */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 900px;
  padding: 2px 10px;
  margin: auto;
  min-height: 50px;
  max-height: 100px;
  overflow-y: auto;
  background-color: #333;
  border: 1px solid #444;
  border-top: none;
  border-radius: 5px;
}

/* 下拉结果项 */
.dropdown-item {
  padding: 10px;
  display: flex;
  cursor: pointer;
  color: #ffffff;
}

.dropdown-item:hover {
  background-color: #444;
}
</style>
