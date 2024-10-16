const numbers = [
    { character: 1, clicked: false },
    { character: 2, clicked: false },
    { character: 3, clicked: false },
    { character: 4, clicked: false },
    { character: 5, clicked: false },
    { character: 6, clicked: false },
    { character: 7, clicked: false },
    { character: 8, clicked: false },
    { character: 9, clicked: false },
    { character: 10, clicked: false },
    { character: 11, clicked: false },
    { character: 12, clicked: false },
    { character: 13, clicked: false },
    { character: 14, clicked: false },
    { character: 15, clicked: false },
    { character: 16, clicked: false },
    { character: 17, clicked: false },
    { character: 18, clicked: false }
]

const icons = [
    {character: 'twitter', clicked: false}, 
    {character: 'instagram', clicked: false}, 
    {character: 'facebook', clicked: false}, 
    {character: 'reddit-alien', clicked: false},
    {character: 'snapchat', clicked: false},
    {character: 'tiktok', clicked: false},
    {character: 'youtube', clicked: false},
    {character: 'pinterest', clicked: false},
    {character: 'whatsapp', clicked: false},
    {character: 'discord', clicked: false},
    {character: 'linkedin', clicked: false},
    {character: 'letterboxd', clicked: false},
    {character: 'twitch', clicked: false},
    {character: 'tumblr', clicked: false},
    {character: 'yelp', clicked: false},
    {character: 'facebook-messenger', clicked: false},
    {character: 'spotify', clicked: false},
    {character: 'steam', clicked: false}
]

function shuffle(array : {character: number | string, clicked: boolean}[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

export {icons, numbers, shuffle}