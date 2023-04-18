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
}

export default new FormService;