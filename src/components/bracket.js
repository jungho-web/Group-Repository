export function Bracket(data) {
    console.log(data);

    var pairs = [];
    if (data.children !== undefined){
        for (var i = 0; i < data.children.length; i++){
            var pair = [];
            pair.push((<h2>Match {i + 1}</h2>));
            for (var j = 0; j < data.children[i].length; j++){
                var lives = "";
                for (var k = 0; k < data.children[i][j][1]; k++){
                    lives += "❤️";
                }
                console.log(lives);
                pair.push((<p>{data.children[i][j][0] + " " + lives}</p>));
            }
            pairs.push(pair);
        }
    }
    return (
        <div>
        <div class="bracket">
            <ol>
            {pairs.map(element => {
                return (<div style={{
                    width: "600px",
                    height: "300px",
                    border: "2px solid white",
                    padding: "10px",
                    margin: "10px"
                }} >{element}</div>);
            })}
            </ol>
        </div>
    </div>
    )

}