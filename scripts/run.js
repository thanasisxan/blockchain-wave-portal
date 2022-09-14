const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();
    console.log("Contract addy:", waveContract.address);

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

    /*
    * Get Contract balance
    */
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );


    let waveStoreMap = {};
    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    console.log(`Total waves before: ${waveCount}`);

    const rndTimes1 = Math.floor(Math.random() * 30) + 1;
    const rndTimes2 = Math.floor(Math.random() * 30) + 1;

    for (let i = 0; i < rndTimes1; i++) {
        let waveTxn = await waveContract.wave(`test wave ${i + rndTimes1}`);
        await waveTxn.wait();
        if (waveTxn.from in waveStoreMap) {
            waveStoreMap[waveTxn.from] += 1;
        } else {
            waveStoreMap[waveTxn.from] = 1;
        }
    }
    for (let i = 0; i < rndTimes2; i++) {
        let waveTxn = await waveContract.connect(randomPerson).wave(`test wave ${i + rndTimes2}`);
        await waveTxn.wait();
        if (waveTxn.from in waveStoreMap) {
            waveStoreMap[waveTxn.from] += 1;
        } else {
            waveStoreMap[waveTxn.from] = 1;
        }
    }
    console.log(waveStoreMap);
    waveCount = await waveContract.getTotalWaves();
    console.log(`Total waves after: ${waveCount}`);


    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
    let topWaverAddr = Object.keys(waveStoreMap).reduce((waverAddrPrev, waverAddrAfter) => waveStoreMap[waverAddrPrev] > waveStoreMap[waverAddrAfter] ? waverAddrPrev : waverAddrAfter);
    /*
    * Get Contract balance to see what happened!
    */
    console.log(
        "Contract balance after:",
        hre.ethers.utils.formatEther(contractBalance)
    );
    console.log(`Champion waver!: ${topWaverAddr}`);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();