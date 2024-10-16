import React from "react";
import { useLocation} from "react-router-dom"
import { icons, numbers, shuffle } from "../utils";
import { Link } from 'react-router-dom';
import Circle from "../components/Circle";
import Player from "../components/Player";
import FinalScoreLabel from "../components/FinalScoreLabel";
import { nanoid } from 'nanoid'

export default function Game() {

   
    const location = useLocation()

    const theme : string = location.state.theme
    const players : number = location.state.players
    const gridSize : string = location.state.gridSize

   
    const [characters, setCharacters] = React.useState<{character : string | number, clicked : boolean}[]>([{character: "", clicked: true}])

    React.useEffect(() => {
        if(theme === 'icons' && gridSize === '4x4') {
            const newArr = shuffle(icons).slice(10)
            const secondArr = newArr
            setCharacters(shuffle(newArr.concat(secondArr)))
        } else if (theme === 'icons' && gridSize === '6x6') {
            const newArr = shuffle(icons)
            const secondArr = newArr
            setCharacters(newArr.concat(secondArr))
        } else if (theme === 'numbers' && gridSize === '4x4') {
            const newArr = shuffle(numbers).slice(10)
            const secondArr = newArr
            setCharacters(shuffle(newArr.concat(secondArr)))
        } else if (theme === 'numbers' && gridSize === '6x6') {
            const newArr = shuffle(numbers)
            const secondArr = newArr
            setCharacters(shuffle(newArr.concat(secondArr)))
        }

    }, [])

    // Menu code
    const [menuStatus, setMenuStatus] = React.useState(false)


    //                                 !!!! GAME LOGIC !!!!                                                     //

    // Correct Pairs
    const [correctPairs, setCorrectPairs] = React.useState<string[]>([])

    //  grid
    const [currentSelected, setSelected] = React.useState<{character: string | number, clicked: boolean}[]>([])

    function changeClick(index : number) {
        setCharacters(prev => {
            const newChars = [...prev]
            newChars[index] = {...newChars[index], clicked: true}
            return newChars
        })

        setSelected(prev => {
            return [...prev, characters[index]]
        })
    }

    // two options are selected
    React.useEffect(() => {
        if(currentSelected?.length === 2) {

            if (currentSelected[0].character === currentSelected[1].character ) {
                setCorrectPairs(prev => [...prev, currentSelected[0].character.toString()]) 
                setPlayerScores(prev => {
                    const newScores = { ...prev }
                    newScores[currentPlayer] += 1
                    return newScores
                })   
            } 

            setTimeout(() => {
                setSelected([])
            }, 500)
            
            setTimeout(() => {
                setCharacters(prev => {
                    return prev.map(oldItem => {
                        if(oldItem.clicked === true) {
                            return {...oldItem, clicked: false}
                        } else {
                            return oldItem
                        }
                    })
                })
            }, 500)

            setMoves(prev => prev + 1)

            setCurrentPlayer(prev => {
                if(prev === players) {
                    return 1 
                } else {
                    return (prev += 1) as 1 | 2 | 3 | 4
                }
                
            })

        } 
    }, [currentSelected])
    
    // Current Player logic
    const [currentPlayer, setCurrentPlayer] = React.useState< 1 | 2 | 3 | 4  >(1)
    const [playerScores, setPlayerScores] = React.useState<{[key: number]: number;}>
    ({
        1: 0,
        2: 0,
        3: 0,
        4: 0
    })

    // Setting up player cards at the bottom of the page
    let playerElements = []

    for (let i = 1; i <= players; i++) {
        playerElements.push(<Player key={nanoid()} player={i} score={playerScores} currentPlayer={currentPlayer} />);
    }

    // Testing for end conditions and determining the winner
    const [endOfGame, setEnd] = React.useState(false)

    const endPairs = gridSize === "4x4" ? 8 : 18

    React.useEffect(() => {
        if(correctPairs.length === endPairs) {
            setEnd(true)

            clearInterval(intervalRef.current!)
        }
    }, [correctPairs])

    const findWinner = () => {
        let bestScore = -1;
        let winners: (keyof typeof playerScores)[] = [];
    
        Object.keys(playerScores).forEach((playerKey) => {
            const player = parseInt(playerKey) as keyof typeof playerScores;
            const score = playerScores[player];
    
            if (score > bestScore) {
                bestScore = score;
                winners = [player];
            } else if (score === bestScore) {
                winners.push(player);
            }
        });
    
        return winners;
    };

    let finalScoreData = []

    for (let i = 0; i < players; i++) {
        const players = Object.keys(playerScores).map(key => parseInt(key))
        const playerScores2 = Object.entries(playerScores)
        const playerNum = players[i]
        const playerScore = playerScores2[i][1]
        finalScoreData.push([playerNum, playerScore])
    }

    let greatestScore = finalScoreData.sort((a, b) => b[1] - a[1])[0][1]

    //  1 person game
    const [seconds, setSeconds] = React.useState<number>(0);
    const [moves, setMoves] = React.useState<number>(0);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
    
    React.useEffect(() => {
        if (players === 1) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [players]);
    
    // Restarting 

    function restartGame() {
        setSeconds(0)
        setCurrentPlayer(1)
        setMoves(0)
        setCorrectPairs([])
        setPlayerScores({
            1: 0,
            2: 0,
            3: 0,
            4: 0
        })
        setSelected([])
        setCharacters(prev => {
            return prev.map(oldItem => {
                if(oldItem.clicked === true) {
                    return {...oldItem, clicked: false}
                } else {
                    return oldItem
                }
            })
        })
        setCharacters(prev => shuffle(prev))
        setMenuStatus(false)
        setEnd(false)

        clearInterval(intervalRef.current!)
        if(players === 1) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)
        }
    
        return () => {
            clearInterval(intervalRef.current!);
        };
    }

    return (

        <main className={`${endOfGame || menuStatus ? "pointer-events-none" : ""} bg-white3 p-8  sm:px-8 h-screen flex flex-col justify-between items-between md:w-4/5 xl:w-4/6 sm:py-12  mx-auto `}>
            <header className="flex justify-between items-center xs:w-full smh:w-4/5 smh:mx-auto">
                <div className="svg-container-game mt-2 w-32 sm:w-40" aria-label="This is the logo for the game.">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 28"><path d="M6.08 21V10.64c0-1.733.287-3.053.86-3.96s1.487-1.36 2.74-1.36c.96 0 1.647.233 2.06.7.413.467.667 1.087.76 1.86.093.773.14 1.627.14 2.56V21h6.12V10.52c0-1.733.28-3.033.84-3.9.56-.867 1.453-1.3 2.68-1.3.987 0 1.693.233 2.12.7.427.467.693 1.087.8 1.86.107.773.16 1.627.16 2.56V21h6.08V8.92c0-2.693-.48-4.753-1.44-6.18C29.04 1.313 27.293.6 24.76.6c-1.387 0-2.673.28-3.86.84a7.44 7.44 0 0 0-2.94 2.48c-.453-1.093-1.153-1.92-2.1-2.48C14.913.88 13.653.6 12.08.6c-1.467 0-2.72.347-3.76 1.04-1.04.693-1.787 1.413-2.24 2.16l-.76-2.64H0V21h6.08Zm39.2.48c1.627 0 3.22-.36 4.78-1.08 1.56-.72 2.86-1.84 3.9-3.36l-4.84-1.76c-.373.427-.9.78-1.58 1.06s-1.487.42-2.42.42c-1.12 0-2.14-.347-3.06-1.04-.92-.693-1.433-1.733-1.54-3.12H55.2c.133-2.347-.2-4.42-1-6.22-.8-1.8-1.98-3.213-3.54-4.24C49.1 1.113 47.227.6 45.04.6c-1.92 0-3.687.427-5.3 1.28a10.074 10.074 0 0 0-3.88 3.6c-.973 1.547-1.46 3.373-1.46 5.48 0 2.187.46 4.067 1.38 5.64a9.228 9.228 0 0 0 3.84 3.62c1.64.84 3.527 1.26 5.66 1.26ZM49.56 9h-9.04c.187-1.36.727-2.347 1.62-2.96.893-.613 1.913-.92 3.06-.92 1.173 0 2.187.327 3.04.98.853.653 1.293 1.62 1.32 2.9Zm14.6 12V10.64c0-1.733.287-3.053.86-3.96s1.487-1.36 2.74-1.36c.96 0 1.647.233 2.06.7.413.467.667 1.087.76 1.86.093.773.14 1.627.14 2.56V21h6.12V10.52c0-1.733.28-3.033.84-3.9.56-.867 1.453-1.3 2.68-1.3.987 0 1.693.233 2.12.7.427.467.693 1.087.8 1.86.107.773.16 1.627.16 2.56V21h6.08V8.92c0-2.693-.48-4.753-1.44-6.18C87.12 1.313 85.373.6 82.84.6c-1.387 0-2.673.28-3.86.84a7.44 7.44 0 0 0-2.94 2.48c-.453-1.093-1.153-1.92-2.1-2.48C72.993.88 71.733.6 70.16.6c-1.467 0-2.72.347-3.76 1.04-1.04.693-1.787 1.413-2.24 2.16l-.76-2.64h-5.32V21h6.08Zm38.84.48c1.813 0 3.52-.373 5.12-1.12 1.6-.747 2.893-1.9 3.88-3.46.987-1.56 1.48-3.527 1.48-5.9 0-2.4-.493-4.367-1.48-5.9-.987-1.533-2.28-2.667-3.88-3.4-1.6-.733-3.307-1.1-5.12-1.1-1.84 0-3.56.367-5.16 1.1-1.6.733-2.893 1.867-3.88 3.4-.987 1.533-1.48 3.5-1.48 5.9 0 2.373.493 4.34 1.48 5.9.987 1.56 2.28 2.713 3.88 3.46 1.6.747 3.32 1.12 5.16 1.12Zm0-4.72c-1.227 0-2.253-.44-3.08-1.32-.827-.88-1.24-2.36-1.24-4.44 0-2.107.42-3.58 1.26-4.42.84-.84 1.86-1.26 3.06-1.26 1.173 0 2.18.42 3.02 1.26.84.84 1.26 2.313 1.26 4.42 0 2.08-.407 3.56-1.22 4.44-.813.88-1.833 1.32-3.06 1.32ZM122.52 21V11c0-1.573.393-2.707 1.18-3.4.787-.693 1.913-1.04 3.38-1.04.293 0 .56.007.8.02.24.013.52.047.84.1V.6c-1.52-.08-2.813.2-3.88.84-1.067.64-1.907 1.76-2.52 3.36l-1.08-3.64h-4.8V21h6.08Zm11.36 6.44c1.733 0 3.107-.187 4.12-.56 1.013-.373 1.847-1.027 2.5-1.96s1.3-2.24 1.94-3.92l7.6-19.84h-6.52l-3.8 12.4-3.88-12.4h-6.52l7.6 19.72c-.213.667-.447 1.153-.7 1.46-.253.307-.607.5-1.06.58-.453.08-1.133.12-2.04.12h-1.2v4.4h1.96Z" fill="#152938" fillRule="nonzero" /></svg>
                </div>
                <button className="bg-darkYellow hover:bg-darkYellowHover font-athl text-white px-4 py-1 rounded-xl font-bold smh:text-2xl lg:hidden " onClick={() => setMenuStatus(true)}>Menu</button>
                <div className="hidden lg:flex">
                    <a onClick={() => restartGame()} className="bg-darkYellow hover:bg-darkYellowHover hover:cursor-pointer  text-white3 font-bold p-2 px-4 rounded-xl mr-2  sm:text-lg">Restart</a>
                    <Link to="/" className="bg-playerCardDefault linkGray hover:bg-lightBlue2 hover:text-white text-darkGray p-2 px-4 rounded-xl font-bold sm:text-lg">Setup New Game</Link>
                </div>
            </header>

            <section className="flex justify-center items-center w-100vw sm:w-4/5 sm:mx-auto xs:mr-4 mt-5">
                <div className={`grid ${gridSize === "4x4" ? "grid-cols-4 gap-y-4 gap-x-6    w-max" : gridSize === "6x6" ? "grid-cols-6 gap-y-3 gap-x-3  w-max" : ""} `}>
                    {characters?.map((char, index) => {
                        const key = nanoid()
                        return <Circle key={key} customKey={key} character={char.character} clicked={char.clicked} theme={theme} changeClick={changeClick} index={index} correctPairs={correctPairs} currentSelected={currentSelected} gridSize={gridSize}/>
                    } )}
                </div>                
            </section>


            <section>
                {players === 1 ?
                <div className="flex justify-center items-center md:mt-8">
                    <div className="bg-playerCardDefault flex flex-col sm:flex-row font-athl justify-center sm:justify-between items-center py-4 sm:py-8 sm:px-6 w-24 sm:w-48 mr-4 rounded-lg">
                        <h2 className="font-bold text-lightBlue sm:text-lg">Timer</h2>
                        <h1 className="font-bold text-darkGray sm:text-lg">{Math.floor(seconds/60)}:{Math.round(seconds % 60) < 10 ? "0" : ""}{Math.round(seconds % 60)}</h1>
                    </div>

                    <div className="bg-playerCardDefault flex flex-col sm:flex-row font-athl justify-center sm:justify-between items-center py-4 sm:py-8 sm:px-6 w-24 sm:w-48 mr-4 rounded-lg">
                        <h2 className="font-bold text-lightBlue"> Moves</h2>
                        <h1 className="font-bold text-darkGray">{moves}</h1>
                    </div>
                </div>
                :
                <div className="flex justify-center items-center lg:mt-8">
                  {playerElements}  
                </div>
                }
            </section>

            <div className={`${endOfGame ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" : "hidden"} `}>

                <div className={`bg-white w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 flex-col justify-center items-center text-center rounded-lg pointer-events-auto  ${players === 1 ? 'hidden' : ''}`}>
                    <h1 className=" text-darkBlack font-bold mb-2 text-3xl">{(findWinner()).length === 1 ? `Player ${findWinner()} Wins!` : `It's a tie!`}</h1>
                    <p className=" text-lightBlue font-bold mb-4 text-lg">Game Over! Here are the results...</p>
                    {finalScoreData.map(scoreData => {
                        return <FinalScoreLabel key={nanoid()} player={scoreData} greatestScore={greatestScore}/>
                    })}
                    <div className="flex flex-col mt-4">
                        <a onClick={() => restartGame()} className="bg-darkYellow hover:bg-darkYellowHover hover:cursor-pointer  text-white3 font-bold p-2 rounded-3xl mb-2 sm:text-xl">Restart</a>
                        <Link to="/" className="bg-playerCardDefault linkGray hover:bg-lightBlue2 hover:text-white text-darkGray p-2 rounded-3xl font-bold sm:text-xl">Setup New Game</Link>    
                    </div>
                </div>

                <div className={`bg-white w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 flex-col justify-center items-center text-center rounded-lg pointer-events-auto  ${players === 1 ? '' : 'hidden'}`}>
                    <h1 className="text-2xl text-darkBlack font-bold mb-2 smh:text-3xl">You did it</h1>
                    <p className="text-xs text-lightBlue font-bold mb-4 smh:text-lg">Game Over! Here's how you got on...</p>
                    <div className="bg-playerCardDefault flex  font-athl justify-between items-center p-4 rounded-lg">
                        <h2 className="font-bold text-lightBlue text-xs smh:text-lg">Time Elapsed</h2>
                        <h1 className="font-bold text-darkGray text-xl">{Math.floor(seconds/60)}:{Math.round(seconds % 60) < 10 ? "0" : ""}{Math.round(seconds % 60)}</h1>
                    </div>
                    <div className="bg-playerCardDefault flex  font-athl justify-between items-center p-4 rounded-lg mt-2">
                        <h2 className="font-bold text-lightBlue text-xs smh:text-lg">Moves</h2>
                        <h1 className="font-bold text-darkGray text-xl">{moves}</h1>
                    </div>
                    <div className="flex flex-col mt-4">
                        <a onClick={() => restartGame()} className="bg-darkYellow hover:bg-darkYellowHover hover:cursor-pointer  text-white3 font-bold p-2 rounded-3xl mb-2 smh:text-xl">Restart</a>
                        <Link to="/" className="bg-playerCardDefault linkGray hover:bg-lightBlue2 hover:text-white text-darkGray p-2 rounded-3xl font-bold smh:text-xl">Setup New Game</Link>    
                    </div>
                </div>
                
            </div>

            {menuStatus ?
                <div className={"fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto"}>
                    <div className="flex flex-col w-4/5 text-center bg-white py-8 px-4 rounded-lg">
                        <a onClick={() => restartGame()} className="bg-darkYellow hover:bg-darkYellowHover hover:cursor-pointer  text-white3 font-bold p-2 rounded-3xl mb-4 text-xl">Restart</a>
                        <Link to="/" className="bg-playerCardDefault linkGray hover:bg-lightBlue2 hover:text-white text-darkGray p-2 rounded-3xl mb-4 font-bold text-xl">Setup New Game</Link>  
                        <button className="bg-playerCardDefault linkGray hover:bg-lightBlue2 hover:text-white text-darkGray p-2 rounded-3xl  font-bold text-xl" 
                        onClick={() => setMenuStatus(false)}>Resume Game</button>  
                    </div>
                </div>
            :
            null
            }
            
        </main>

    )
    
}