
const sprites = []
const CASSETTE_HEIGHT = 150

function shuffle(originalArray, rng = Math.random) {
    const array = [...originalArray]
    let m = array.length
    while (--m > 0) {
        let i = Math.floor(rng() * (m + 1))
        let temp = array[m]
        array[m] = array[i]
        array[i] = temp
    }
    return array
}

const CompoundWords = [
    ['Hair', 'Cut'],
    ['Rock', 'Band'],
    ['Sound', 'Proof'],
    ['Car', 'Wash'],
    ['Earth', 'Quake'],
    ['Fire', 'Fly'],
    ['Hand', 'Cuff'],
    ['Nose', 'Bleed'],
    ['Rain', 'Drop'],
    ['Rocket', 'Ship'],
    ['Angel', 'Fish']
]
const Contractions = [
    'Against the',
    'Band feat Mr.',
    'Toy',
    'to the',
    'Your',
    'My Pretty',
    'the Healing',
    'Day and the',
    'Matthews',
    'the'
]

const Titles = [
    'One Love',
    'Midnight Sonata',
    'Fight For Your Right To Party',
    'Nothing Left',
    'Stuck in the Middle With You',
    'Can\'t Be This East-y',
    'Bumped the Corner',
    'Fat Bottom Girls',
    'Last Night'
]
const Colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'indigo',
    'violet',
    'brown',
    'grey'
]

export class Cassettes {
    public static CreateCassettes(): Cassette[] {
        const shuffledCompoundWords = shuffle(CompoundWords)
        const shuffledContractions = shuffle(Contractions)
        const shuffledTitles = shuffle(Titles)
        const shuffledColors = shuffle(Colors)

        const Artists = shuffledCompoundWords
            .slice(0, 9)
            .map((wordArray, i) => {
            const nextWord = shuffledCompoundWords[(i+1) % 9][0]
            return `${wordArray[1]} ${shuffledContractions[i]} ${nextWord}`
        })
        const oddArtistOut = `${shuffledCompoundWords[9][1]} ${shuffledContractions[9]} ${shuffledCompoundWords[10][0]}`
        const shuffledArtists = shuffle(Artists)
        shuffledArtists.push(oddArtistOut)
        return shuffledArtists.map((artist, index) => ({
            index,
            artist,
            color: shuffledColors[index],
            title: shuffledTitles[index]
        }))
    }
}

export interface Cassette {
    index: number
    artist: string
    title: string
    color: string
}