import ImageKit from "@imagekit/nodejs";

console.log("=== ImageKit Debug ===");
console.log("ImageKit constructor:", ImageKit);
console.log("ImageKit type:", typeof ImageKit);

var imagekit = new ImageKit({
    publicKey: process.env.ImageKit_PUBLIC_KEY,
    privateKey: process.env.ImageKit_PRIVATE_KEY,
    urlEndpoint: process.env.ImageKit_URL_ENDPOINT
});

console.log("ImageKit instance:", imagekit);
console.log("ImageKit instance type:", typeof imagekit);
console.log("ImageKit upload method:", imagekit.upload);
console.log("ImageKit upload type:", typeof imagekit.upload);
console.log("ImageKit methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(imagekit)));
console.log("=== End ImageKit Debug ===");

export default imagekit;
