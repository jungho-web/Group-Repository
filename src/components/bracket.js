export function Bracket(data) {

    var pairs = [];
    if (data.children !== undefined){
        for (var i = 0; i < data.children.length; i++){
            var pair = [];
            for (var j = 0; j < data.children[i].length; j++){
                pair.push((<p>{data.children[i][j]}</p>));
            }
            pairs.push(pairs);
        }
    }
    return (
        <div>
        <div class="bracket">
            <ol>
            {pairs.map(element => {
                return (<li><div style={{
                    width: "600px",
                    height: "150px",
                    border: "2px solid white",
                    padding: "10px",
                    margin: "10px"
                }} >{element}</div></li>);
            })}
            </ol>
        </div>
    </div>
    )

}