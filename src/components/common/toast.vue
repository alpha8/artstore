<template>
  <div>
    <div class="toast" :class="{'icon_toast': icon}">
      <i class="icon icon_success" v-if="icon == 'success'" style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAzUExURUdwTP///////////////////////////////////////////////////////////////8/RimEAAAAQdFJOUwAVCMTyVGog4qLUkCo9ga9ti6GsAAADJklEQVRo3r2aSYKEIAxFmScFvf9puw1oaZUoUYBNL9rySfITCIGQwkG9ChN3RsxCGMenoDwlNYeW1swnw1hZCTQGN18MF8a3BKr4fDu4ejMfPYjtTcLZIP2oKWNUj14G63b/HPRThN3ewYNnvw8wH/gKEvYJhg0rYpLs4jE5rc8NDMuQSU7u3t5UJWUYibNUcrcr/JlMGI6wmRQoxA4jJM4bQuFsrATCMzSaakKrRUcJ8IKg0SZO44no42TM7eeNwHAPU8UInjE3v/bwLZY9zREMAlj4yy8BxvAm24FqxHjnj/Aup4Zrv1BgKPJyKKBkNMZ4FUaicJa35kAqjPybJOiqzmoKGjvJMHoRlmN1IGyJF/HrfH6jPGRULp/MT40lSbVx9j5m6jnk4xbDfvQgqm7WqPhWmK4UIT/Ror/m5kjl4Y4egIn42hB/nMpwprf3g++9Aj6S9SFyrybVwiOrV9RuWqoFRH3cMC6zYi0gbPHDuC1lljQZdltoXRW3U5ZxvVuDRFRYp063KCKFykKbatjlLNKmZCVbQVuwEk4ZfS3+NpsC3jFOd0GLcs2/w+KfNow4BQppjDdjQKB7sNrQjAG5V0EoqmYMmEMAkflmDPDGBEYbmzFAXhySCm3GAPE60BhrxiAMImTJLu0YhEBmFI/TYxEjvv9xDi5jREs9NVchI04i73hGKzCi47MS/q+2h9eMJOFsMPKLpb+YkYIxm1amfHlXzkhpJZsgY1Fv3zFSgsyn+hwFw0ip/mLROqegGGnRulp+zyg4Rlp+LzcSvxQkI20krrdE3xQkY9sSXW/ujhQsY9vc3WxT9xQ0AzIjLdhwfyh4xrbhvi0dEoXhGbvS4bYIihSDZ+yKoPtyTq99IBxjX84VFKaJgmQcCtOCEhsoWMahxC45LNBccOzB+uGwoM+xR5cDnD5HUV0O1focD3Y56OxzZNvn8LnLMXqfhkC91ka4aG10adL0aTf1aZz1aQH2aWb2acv2aTDvWuU4b6Ba5aRL05/0ub5AulzEIH2ulBDk5ZjZPr6D0/6aT7R38wtLMVU0v3qVzJa/RKZJzfHmOtwfmAFYjRpHm7sAAAAASUVORK5CYII=)"></i>
      <i class="icon icon_warning" v-else-if="icon == 'warning'" style="background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkBAMAAACCzIhnAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUdwTOk7Pek7Peo7PfdLS+0/QPBCQus9Puo7Peo7Peo7Peo8Pus8Puo7Pek7PXsRad8AAAAOdFJOUwDg9ogHIhU3u8yjXlJyJjVnBAAAAuJJREFUWMO9WM9rE1EQ3tJt+iMKgnpQZA/FooKGFhRBIUQLonip9aB4kIiCgrSEil6EIqJehKDiyUNRxIOXEFDUk6h/gIgHj0JS1LTq9zc4b3ebbDczu+/NwTkE9m2+t29mvje/PI+Ry69ePhwf3/bk8A3PTq4+Q1e2v7EADE1hnWyeyUPMLSElK9+yEadL5l97nr+9funYmZuHHpmn9oEsxDmD6BysrD37124bzAsZMW02vV9JLvnvzNp+CVEMgFbfyefM6gfBVnV697p//SRhOrzdPkm7bSDMXkGRtnDm6RKrToEcclfS8iy5p9q3egrYJ9vyK7A1vTYcoFWTIdzrBeBelpOvALtSu5SwWsmkUgPtWlqTyWz2Daa0KQT4m8fx72gljXYi9yPhZx4nHstYzb98DSwnGAHcyYccB3p8ml1/TEFI4YnuQz1tc14W0Emc64sNZGPvZEd66GypY0vXXhN2kNk1mw1ZOKXrmuh2jqHF0Ovjjv41P8DT+HN/mB2DFrP4OVahjE3MW4BZHIiUKZTQtIUU0a6G1uZU4SGkjPHgKM97FkI34AH9nsdPe8g8foTa37KHjIT6B6z2AqQIsn0B7Yo9xC+hSjiekzyEmNkkuiy7QMpEmQH8coEsElXmsdMFcpRcshg6xxoySod6H/PZEjKG36TPpAtkkKzV4D0pQYoUJJdQc4EMY0UDCTDjAhkikhnSOECIkgSpuEB8LcT5YAr1/49fFIRR0FIiPxvGI/JLV4xLFvEVky6yIOYiS+FCEBMupKAkiAlKRdt03At9BaBijwgDrBTGherbhHEpWfASJQshJfESpSQh8fGujBKfkF5ZwsTpVZHEFaWCpiBRlD2K4kpRwnkX3AtFh3K0qS96NaW1XQE/kizgFW2CphlRtDyKxiq/ffP72jdFk6hpRRUNr6atVjTvmhGBZhAR7uY27vC8i85DlXh0s9tldKMZEGnGUJphl2aklj+4+we41lWyUPLC5gAAAABJRU5ErkJggg==)"></i>
      <p class="toast_content" v-html="text"></p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['text', 'icon']
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .toast
    position: fixed
    z-index: 10000
    min-width: 128px
    max-width: 270px
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    margin: auto
    background: rgba(0,0,0,.7)
    text-align: center
    border-radius: 5px
    color: #fff
    overflow: hidden
    &.icon_toast .toast_content
      line-height: 1
      padding-top: 0
    >.icon
      display: block
      width: 50px
      height: 50px
      margin: 5px auto 10px
      background-size: 50px auto
    .toast_content
      font-size: 14px
      max-height: 200px
      line-height: 1.5
      padding: 20px 10px
      vertical-align: middle
      word-break: break-word
      text-overflow: ellipsis
      overflow: hidden
      -webkit-box-orient: vertical
      text-align: center
</style>
