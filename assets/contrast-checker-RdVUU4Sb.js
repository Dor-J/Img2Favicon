import{t as e}from"./shared-DpybSr3x.js";import{t}from"./toast-lv42anyN.js";import{r as n}from"./color-CKa2WVsp.js";import{r}from"./encode-DsbjXOzB.js";import{t as i}from"./toolHelpers-CQsi2vg5.js";function a(e){let{r:t,g:r,b:i}=n(e),[a,o,s]=[t,r,i].map(e=>{let t=e/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4});return .2126*a+.7152*o+.0722*s}function o(e,t){let n=a(e),r=a(t),i=Math.max(n,r),o=Math.min(n,r);return(i+.05)/(o+.05)}function s(e,t){let n=o(e,t);return{ratio:n,ratioFormatted:n.toFixed(2),normalAA:n>=4.5,normalAAA:n>=7,largeAA:n>=3,largeAAA:n>=4.5}}var c=i(`#fgColor`),l=i(`#bgColor`),u=i(`#contrastResult`),d=i(`#contrastSwatch`);function f(){let e=s(c.value,l.value);d.style.background=l.value,d.style.color=c.value,d.textContent=`Sample text Aa`,u.innerHTML=`
    <p><strong>Contrast ratio:</strong> ${e.ratioFormatted}:1</p>
    <ul class="contrast-list">
      <li class="${e.normalAA?`pass`:`fail`}">Normal text AA (4.5:1): ${e.normalAA?`Pass`:`Fail`}</li>
      <li class="${e.normalAAA?`pass`:`fail`}">Normal text AAA (7:1): ${e.normalAAA?`Pass`:`Fail`}</li>
      <li class="${e.largeAA?`pass`:`fail`}">Large text AA (3:1): ${e.largeAA?`Pass`:`Fail`}</li>
      <li class="${e.largeAAA?`pass`:`fail`}">Large text AAA (4.5:1): ${e.largeAAA?`Pass`:`Fail`}</li>
    </ul>`}e({activeToolId:`contrast-checker`}),[c,l].forEach(e=>e.addEventListener(`input`,f)),i(`#copyRatio`).addEventListener(`click`,async()=>{await r(s(c.value,l.value).ratioFormatted),t(`Ratio copied.`)}),f();
//# sourceMappingURL=contrast-checker-RdVUU4Sb.js.map