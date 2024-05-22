let NFTs = [];

function mintNFT (name , img , nickname , currency , value ) {
    let nft = {
        name,
        img,
        nickname,
        currency,
        value
    }
    NFTs.push(nft);
}

function listNFTs () {
    NFTs.forEach((nft)=>{
        console.log(nft)
    })

}

function getTotalSupply() {
    console.log("Number of NFTs minted : " , NFTs.length)
}

// Fn calls

mintNFT("dogecoin" , "blackforest" , "dcx" , "dollar" , 100 );
mintNFT("dogecoin" , "blackforest" , "dcx" , "dollar" , 100 );
mintNFT("dogecoin" , "blackforest" , "dcx" , "dollar" , 100 );
mintNFT("dogecoin" , "blackforest" , "dcx" , "dollar" , 100 );

listNFTs();

getTotalSupply();

