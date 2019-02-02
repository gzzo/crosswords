const glob = require('glob')
const fs = require('fs')
const _ = require('lodash')

const puzzleFiles = {}

glob('**/*.json', { cwd: 'dist/puzzles'}, function (er, files) {
  _.each(files, file => {
    [ category, fileName ] = file.split('/')

    if (!puzzleFiles[category]) {
      puzzleFiles[category] = []
    }

    puzzleFiles[category].push(fileName.replace('.json', ''))
  })

  fs.writeFile('src/puzzleFiles.json', JSON.stringify(puzzleFiles), function(err) {
    console.log('Done')
  })
})
