
export default function FinalScoreLabel({ player, greatestScore } : {player : number[], greatestScore : number}) {

    return (
        <div className={`  ${greatestScore === player[1] ? 'bg-darkBlack text-white' : 'bg-playerCardDefault'} flex justify-between items-center p-2 lg:p-4 mb-2 font-bold rounded-lg`}>
            <h1 className={` ${greatestScore === player[1] ? "" : "text-lightBlue"}  text-lg`}>Player {player[0]} {greatestScore === player[1] ? "(Winner!)" : ""}</h1>
            <h1 className=" lg:text-xl">{player[1]}</h1>
        </div>
    )

}