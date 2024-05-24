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
        console.log(
        "\n\nName : ",nft.name,
        "\nimg : ",nft.img,
        "\nnickname : ",nft.nickname,
        "\ncurrency : ",nft.currency,
        "\nvalue : ",nft.value)
    })

}


function getTotalSupply() {
    console.log("Number of NFTs minted : " , NFTs.length)
}

mintNFT("dogecoin" , "blackforest" , "dcx" , "dollar" , 100 );
mintNFT("dogecoin" , "blackforest" , "dcx" , "dollar" , 100 );
mintNFT("dogecoin" , "blackforest" , "dcx" , "dollar" , 100 );
mintNFT("dogecoin" , "blackforest" , "dcx" , "dollar" , 100 );

listNFTs();

getTotalSupply();