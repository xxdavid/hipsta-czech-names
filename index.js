const fs = require('fs')
const readline = require('readline')
const XRegExp = require('xregexp')

const lineReader = readline.createInterface({
  input: require('fs').createReadStream('./data.csv')
})

var i = 0
const names = []
lineReader.on('line', (line) => {
  i++
  if (i === 1) return
  if (line.includes('?')) return

  const regex = XRegExp('^(\\pL*).*,(\\d*)$')
  const matches = XRegExp.exec(line, regex)
  const name = matches[1].charAt(0) + matches[1].slice(1).toLowerCase()
  const count = Number.parseInt(matches[2])


  const index = names.findIndex(el => el.name === name)
  if (index === -1) {
    names.push({
        name,
        count
    })
  } else {
    names[index] = {
        name,
        count: names[index].count + count
    }
  }
})

lineReader.on('close', () => {
  names.sort((a, b) => {
    const difference = a.count - b.count
    if (difference != 0) {
      return difference
    } else {
      return a.name.localeCompare(b.name, "cs-CZ")
    }
  })

  var outputText = ''
  names.forEach((value) => {
    outputText += `${value.count} ${value.name}\n`
  })
  fs.writeFileSync('names.txt', outputText)

  var outputJSON = JSON.stringify(names, null, 2)
  fs.writeFileSync('names.json', outputJSON)
})