class FormService {

    public requiredMessage: string = "Pole nie może być puste"
    public invalidFormatMessage: string = "Niepoprawny format"

    checkIfIsRequired(input?: string){
        return input && input !== ""
    }

    checkIfIsEmail(input: string){
        const  re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(input);
    }

    checkIfIsAdult(input: Date){
        const actualDate: Date = new Date()
        const diff = actualDate.getTime() - input.getTime()
        const diffDate = new Date(diff)

        return diffDate.getUTCFullYear() - 1970 >= 18
    }
}

export default new FormService;