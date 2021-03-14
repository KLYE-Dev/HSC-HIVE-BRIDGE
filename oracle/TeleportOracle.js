module.exports = (params) => {
    const { gloryHole, onData } = params;

    gloryHole.methods.closed().call()
    .then(result => {
        if (result === true){
            console.log("(EE) gloryHole closed ... exiting");
            process.exit(0);
        }
    })

    gloryHole.events.Teleport({
//        fromBlock: 0
    })
        .on('data', event => {
            if (onData) {
                onData(event);
            }
            else
                console.log("(II) gloryHole event " + event.returnValues);
        })
        .on('changed', reason => console.log("(WW) TeleportOracle: " + reason))
        .on('error', reason => console.log("(EE) TeleportOracle: " + reason));

    gloryHole.events.Closed({
    })
        .on('data', () => {
            console.log("(END) gloryHole closed ... exiting");
            process.exit(0);
        })
        .on('changed', reason => console.log("(WW) TeleportOracle: " + reason))
        .on('error', reason => console.log("(EE) TeleportOracle: " + reason));
}
