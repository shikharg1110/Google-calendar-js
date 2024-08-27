// var i = 0;
// for(i = 0; i < 15; i++) {
//     function hello(i) {
//         setTimeout(() => {
//             console.log(i);
//         }, i*1000);
//     }
//     hello(i);
// }



let st = "This is";
String.prototype.shikhar = function() {
    console.log(this+ " shikhar");
}
st.shikhar();