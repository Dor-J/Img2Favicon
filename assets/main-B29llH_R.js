import{i as e,n as t,r as n,t as r}from"./shared-DpybSr3x.js";r();var i=document.querySelector(`#hubGrid`);i&&!i.querySelector(`.hub-card`)&&(i.innerHTML=n.map(t=>`
    <a class="hub-card" href="${e(t.href)}">
      <span class="hub-card-icon"><i data-lucide="${t.icon}"></i></span>
      <h2>${t.title}</h2>
      <p>${t.description}</p>
    </a>`).join(``),t());
//# sourceMappingURL=main-B29llH_R.js.map