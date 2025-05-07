let sourceList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let index = 0;
let resultList = [];
let rowNum = 5;

async function runUnshift() {
    let rowLength = sourceList.length

    let rows = sourceList.slice(0, rowLength - index)
    // 去除的数据补充到尾部
    rows.unshift(...sourceList.slice(rowLength - index, rowLength))

    resultList = rows.slice(0, rowNum + 1)
    await new Promise(resolve => setTimeout(resolve, 100))
    index += 1;
    const back = index - rowLength
    if (back >= 0) {
        index = back
    }

    index = index;
   
    setTimeout(runUnshift, 2000);
}


async function runPush() {
    let rowLength = sourceList.length
    let rows = sourceList.slice(index)

    // 去除的数据补充到尾部
    rows.push(...sourceList.slice(0, index))
    resultList = rows.slice(0, rowNum + 1)
    await new Promise(resolve => setTimeout(resolve, 100))
    index += 1;
    const back = index - rowLength
    if (back >= 0) {
        index = back
    }

    index = index;
    setTimeout(runPush, 2000);
}