class  CalcController{
    constructor(){

        this._locale = 'pt-BR'
        this._operation = []
        this._lastOperator = ''
        this._lastNumber = ''
        this._audioOnOff = false
        this._audio = new Audio('click.mp3')

        // Select element display
        this._displayCalcEl = document.querySelector("#display")
        this._dateEl = document.querySelector("#data")
        this._timeEl = document. querySelector("#hora")

        this._currentDate
        this.initialize()
        this.initButtonsEvents()
        this.initkeyboard()
        this.copyToClipboard()
    }
    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text')
            this.displayCalc = parseFloat(text)
        })
    }
    copyToClipboard(){
        let input = document.createElement('input')
        input.value = this.displayCalc
        document.body.appendChild(input)
        input.select()
        document.execCommand("Copy")
        input.remove()
    }
    initialize(){
        this.setDisplayDateTime()

        setInterval(()=>{
            this.setDisplayDateTime()
        }, 1000)
        this.setLastNumberToDisplay()
        this.copyToClipboard()
        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio()
            })
        })
    }
    toggleAudio(){
        // this._audioOnOff = (this.audioOnOff) ? false : true
        this._audioOnOff = !this.audioOnOff
    }
    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0
            this._audio.play()
        }
    }
    initkeyboard(){
        document.addEventListener('keyup', e=>{
            this.playAudio()
            // console.log(e)
            switch(e.key){
                case 'Scape':
                case ' ':
                    this.clearAll()
                break
                case 'Backspace':
                    this.clearEntry()
                break
                case '+':
                case '-':
                case '/':
                case '%':
                case '*':
                    this.addOperation(e.key)
                break 
                case 'Enter':
                case '=': 
                    this.calc()
                break
                case '.':
                case ',':
                    this.addDot()
                break
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key))
                break
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard()
                break
            }
        })
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn, false)
        })
    }

    getLastOperation(){
        return this._operation[this._operation.length-1]
    }
    
    clearAll(){
        this._operation = []
        this._lastNumber = ''
        this._lastOperator = ''
        this.setLastNumberToDisplay()
    }
    clearEntry(){
        this._operation.pop()
        this.setLastNumberToDisplay()
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value
    }

    pushOperation(value){
        this._operation.push(value)
        if(this._operation.length > 3){
            this.calc()
            // console.log(this._operation)
        }
    }

    getResult(){
        try{
            // console.log('getResult'+this._operation)
            return eval(this._operation.join(''))
        }catch(e){
            setTimeout(()=>{
                this.setError()
            }, 1)
            // console.log(e)
        }
    }

    calc(){
        let last = '' 
        this._lastOperator = this.getLastItem()
        // tirando o último elemento e guardando e validando os 3 númerios 
        if(this._operation.length < 3){
            let firtItem = this._operation[0] 
            this._operation = [firtItem, this._lastOperator, this._lastNumber]
        }
        if(this._operation.length > 3){
            last = this._operation.pop()
            this._lastNumber = this.getResult()
        }else
        if(this._operation.length == 3){
            this._lastNumber = this.getLastItem(false)
        }
        // console.log('lastOperator'+this._lastOperator)
        // console.log('lasNumber'+this._lastNumber)
        // retirando do array com o join('') e fazendo eval()
        let result = this.getResult()
        // calculo a porcentagem
        if(last == '%'){
            result /= 100
            this._operation = [result]
        }else{
            // Pegando resultado e o último elemento
            this._operation = [result]
            // validando add sómente se existir
            if(last) this._operation.push(last)
        }
        this.setLastNumberToDisplay()
    }

    isOperation(value){
        return (['+', '-', '%', '/', '*' ].indexOf(value) > -1)
    }
    getLastItem(isOperator = true){
        let lastItem
        for (let  i = this._operation.length-1; i >= 0; i--){
            if(this.isOperation(this._operation[i]) == isOperator){
                lastItem = this._operation[i]
                break 
            }
        }
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        }
        return lastItem
    }
    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false)
        if(!lastNumber) lastNumber = 0
        this.displayCalc = lastNumber
    }

    addOperation(value){
        // console.log(this.getLastOperation())
        if(isNaN(this.getLastOperation())){
            // trocar operador
            if(this.isOperation(value )){
                this.setLastOperation(value)
            }else{
                this.pushOperation(value)
                this.setLastNumberToDisplay()
            }
        }else{
            if(this.isOperation(value)){
                // é um operador
                this.pushOperation(value)
            }else{
                // não é um operador 
                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(newValue)
                // atualizando display
                this.setLastNumberToDisplay()
            }
        }
        // console.log(this._operation)
    }
    setError(){
        this.displayCalc = 'Error'
    }
    addDot(){
        let lastOperation = this.getLastOperation()
        if(typeof lastOperation === 'string ' && lastOperation.split('').indexOf('.') > -1 ) return
        // console.log(lastOperation)
        if(this.isOperation(lastOperation) || !lastOperation){
            this.pushOperation('0.')
        }else{
            this.setLastOperation(lastOperation.toString() + '.')
        }
        this.setLastNumberToDisplay()
    }

    execBtn(value){
        this.playAudio()
        switch(value){
            case 'ac':
                this.clearAll()
            break
            case 'ce':
                this.clearEntry()
            break
            case 'soma':
                this.addOperation('+')
            break
            case 'subtracao':
                this.addOperation('-')
            break
            case 'divisao':
                this.addOperation('/')
            break
            case 'multiplicacao':
                this.addOperation('*')
            break
            case 'porcento':
                this.addOperation('%')
            break
            case 'igual':
                this.calc()
            break
            case 'ponto':
                this.addDot()
            break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
            break
            default:
                this.setError()
            break
        }
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g")

        buttons.forEach( (btn,index) => {
            this.addEventListenerAll(btn, 'click drag', e=>{
                let textBtn = btn.className.baseVal.replace("btn-","")
                this.execBtn(textBtn) 
            })
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=>{
                btn.style.cursor =  'pointer'
            })
        })
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        if(value.toString().length > 10){
            this.setError()
            return false
        }
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate.innerHTML = value;
    }
}