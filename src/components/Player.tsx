
export default function Player({player, score, currentPlayer} : {player : number, score: { [key: number]: number }, currentPlayer : number}) {


    return(
        <>
            
            <div className={`${currentPlayer === player ? "bg-darkYellow currenttriangle" : "bg-playerCardDefault"}  p-4 w-16 flex flex-col items-center mr-4 font-athl player relative sm:hidden`}>
                <h1 className={` ${currentPlayer === player ? "text-white" : "text-lightBlue"} font-bold`}>P{player}</h1>
                <h1 className={` ${currentPlayer === player ? "text-white" : "text-darkGray"} font-bold` }>{score[player]}</h1>
            </div>

            <div className={`${currentPlayer === player ? "bg-darkYellow current currenttriangle" : "bg-playerCardDefault"}  p-4 w-48 hidden sm:flex flex-col items-center mr-4 font-athl player relative `}>
                <h1 className={` ${currentPlayer === player ? "text-white" : "text-lightBlue"} font-bold self-start text-lg`}>Player {player}</h1>
                <h1 className={` ${currentPlayer === player ? "text-white" : "text-darkGray"} font-bold self-start text-lg` }>{score[player]}</h1>
            </div>
        </>

    )

}