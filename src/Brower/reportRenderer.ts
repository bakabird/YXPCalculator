namespace reportRenderer {
    class CardListWrap {
        private _cardBlue: JQuery<HTMLElement>;
        constructor(private _node: JQuery<HTMLElement>) {
            this._cardBlue = $(".Hub .Card");
        }
        public build(cards: Array<any>) {
            cards.forEach((v,i)=>{
                var item = this._cardBlue.clone();
                item.children("img").attr("src", `./img/${v.name}_${v.level}级.png`);
                this._node.append(item);
            })
        }
    }

    class ReportDetailWrap {
        private _itemBlue: JQuery<HTMLElement>;
        constructor(private _node: JQuery<HTMLElement>) {
            this._itemBlue = $(".Hub .reportItem")
        }
        public build(fr) {
            var item = this._itemBlue.clone();
            item.children(".roundIdx").text("回合数");
            item.children(".useCard").text("使用卡牌");
            item.children(".meChg").text("己方生命变化")
            item.children(".meHp").text("己方生命")
            item.children(".heHp").text("敌方生命")
            item.children(".heChg").text("敌方生命变化")
            this._node.append(item);

            fr.meRoundHp.forEach((_,idx)=>{
                var item = this._itemBlue.clone();
                item.children(".roundIdx").text(idx);
                if(fr.meUseCard.length > idx) {
                    item.children(".useCard").text(fr.meUseCard[idx].join(" "));
                }
                item.children(".meHp").text(`${fr.meRoundHp[idx]}/${fr.meRoundMaxHp[idx]}`)
                item.children(".heHp").text(`${fr.heRoundHp[idx]}/${fr.heRoundMaxHp[idx]}`)
                if (idx > 0) {
                    var meChg = fr.meRoundHp[idx] - fr.meRoundHp[idx - 1];
                    var meMaxChg = fr.meRoundMaxHp[idx] - fr.meRoundMaxHp[idx - 1];
                    var heChg = fr.heRoundHp[idx] - fr.heRoundHp[idx - 1];
                    var heMaxChg = fr.heRoundMaxHp[idx] - fr.heRoundMaxHp[idx - 1];
                    item.children(".meChg").text(`${meChg} | ${meMaxChg}`)
                    item.children(".heChg").text(`${heChg} | ${heMaxChg}`)
                }
                this._node.append(item);
            })            
        }
    }
    
    class RecommendWrap {
        private _blue: JQuery<HTMLElement>;
        constructor(private _node: JQuery<HTMLElement>) {
            this._blue = $(".Hub .cards");
        }
        public build(aiRcmd) {
            var item = this._blue.clone();
            var list = new CardListWrap(item);
            list.build(aiRcmd.meCards);
            this._node.append(item);
        }
    }
    
    window.electronAPI.onProcessOver((_, sumamry)=>{
        $(".waiting").addClass("hide");
        $(".body").removeClass("hide");
        var clw = new CardListWrap($(".body .cards"));
        var rdw = new ReportDetailWrap($(".body .curFightReport"))
        var rw = new RecommendWrap($(".rcmd"));
        clw.build(sumamry.cur.meCards);
        rdw.build(sumamry.cur);
        $(".fightLog").text(sumamry.cur.log);
        rw.build(sumamry.dmgBest);
    });
}
