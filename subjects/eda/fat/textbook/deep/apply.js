(()=>{"use strict";
const all=window.EDA_TEXTBOOK||[];
const additions=window.EDA_DEEP||{};
let augmented=0;
for(const mod of all)for(const ch of mod.chapters){if(additions[ch.id]){ch.content+="\n"+additions[ch.id];augmented++}}
window.EDA_DEEP_COUNT=augmented;
})();