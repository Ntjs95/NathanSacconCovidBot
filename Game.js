const GameState = Object.freeze({
    BEGIN: Symbol("begin"),
    PRECHOOSE: Symbol("prechoose"),
    CHOOSE: Symbol("choose"),
    CHECKRESULTS: Symbol("checkresults"),
    HEALTHCARD: Symbol("healthcard"),
    FULLNAME: Symbol("fullname"),
    DATEOFBIRTH: Symbol("dateofbirth"),
    CONFIRMINFO: Symbol("confirminfo"),
    INFOBAD: Symbol("infobad"),
    INFOGOOD: Symbol("infogood"),
    RESULT: Symbol("result"),
    TAKEASSESSMENT: Symbol("takeassessment"),
    PRIVACY: Symbol("privacy"),
    QUESTION1: Symbol("question1"),
    QUESTION2: Symbol("question2"),
    QUESTION3: Symbol("question3"),
    QUESTION4: Symbol("question4"),
    QUESTION5: Symbol("question5"),
    QUESTION6: Symbol("question6"),
    SYMPTOMS: Symbol("symptoms"),
    ASSESSMENTRESULT: Symbol("assessmentresult"),
});

export default class Game {
    constructor() {
        this.stateCur = GameState.BEGIN;
        this.age = -1;
        this.fever = false;
        this.cough = false;
        this.shortbreath = false;
        this.sorethroat = false;
        this.runnynose = false;
        this.headache = false;
        this.symptomTime = "";
        this.healthcardNum = "";
        this.healthcardName = "";
        this.healthcardDate = "";
    }

    makeAMove(sInput) {
        let sReply = "";
        switch (this.stateCur) {
            case GameState.BEGIN:
                sReply = "Welcome to the COVID-19 information app. To get started respond to this text.";
                if (sInput) {
                    this.stateCur = GameState.PRECHOOSE;
                }
                break;
            case GameState.PRECHOOSE:
                sReply = "Please respond with RESULTS to check results of a test, or respond ASSESSMENT to see if you should take a test.";
                this.stateCur = GameState.CHOOSE;
                break;
            case GameState.CHOOSE:
                if (sInput.toLowerCase().match("results")) {
                    this.stateCur = GameState.HEALTHCARD;
                    sReply = "Please enter your health card number:"
                } else if (sInput.toLowerCase().match("assessment")) {
                    this.stateCur = GameState.PRIVACY;
                    sReply = "Before you take the assessment you must agree to the privacy terms. We will not use your info for any reason other than this assessment. Type AGREE to continue."
                } else {
                    sReply = "You must choose RESULTS or ASSESSMENT";
                }
                break;
            case GameState.PRIVACY:
                if (sInput.toLowerCase().match("agree")) {
                    this.stateCur = GameState.QUESTION1;
                    sReply = "Question #1 - Enter your age:";
                } else {
                    sReply = "You must AGREE";
                }
                break;
            case GameState.HEALTHCARD:
                this.healthcardNum = sInput;
                sReply = "Please enter the full name on your health card:";
                this.stateCur = GameState.FULLNAME;
                break;
            case GameState.FULLNAME:
                this.healthcardName = sInput;
                sReply = "Please enter your date of birth in dd/mm/yyyy format:";
                this.stateCur = GameState.DATEOFBIRTH;
                break;
            case GameState.DATEOFBIRTH:
                this.healthcardDate = sInput;
                sReply = "Based on this information you have given, your health card number is: [" + this.healthcardNum + "]. Your full name is: [" + this.healthcardName + "]. And your date of birth is: [" + this.healthcardDate + "]. If this data is correct type CONFIRMED, otherwise type FIX. This information is crucial for finding your results.";
                this.stateCur = GameState.CONFIRMINFO;
                break;
            case GameState.CONFIRMINFO:
                if (sInput.toLowerCase().match("confirmed")) {
                    var textArray = [
                        'POSITIVE',
                        'NEGATIVE',
                        'NEGATIVE'
                    ];
                    var randomNumber = Math.floor(Math.random() * textArray.length);
                    var testResult = textArray[randomNumber];
                    if (testResult == "POSITIVE") {
                        sReply = "Your result is: " + testResult + ". Please contact your local COVID-19 test center to begin the contact tracing process. Thank you for using the COVID-19 chat bot."
                    } else {
                        sReply = "Your result is: " + testResult + ". If you develop symptoms or have close contact with someone with COVID-19 please get tested again. Thank you for using the COVID-19 chat bot."
                    }
                    this.stateCur = GameState.BEGIN;
                } else if (sInput.toLowerCase().match("fix")) {
                    this.stateCur = GameState.HEALTHCARD;
                    sReply = "Please enter your health card number:"
                } else {
                    sReply = "You must choose CONFIRMED or FIX";
                }
                break;
            case GameState.QUESTION1:
                var inputNum = parseInt(sInput);
                if (isNaN(inputNum) || inputNum > 120 || inputNum < 1) {
                    sReply = "You must enter a number between 1-120.";
                } else {
                    this.age = inputNum;
                    this.stateCur = GameState.QUESTION2
                    sReply = "Do you have a fever? YES or NO";
                }
                break;
            case GameState.QUESTION2:
                if (sInput.toLowerCase().match("yes")) {
                    this.stateCur = GameState.QUESTION3;
                    this.fever = true;
                    sReply = "Do you have a cough? YES or NO"
                } else if (sInput.toLowerCase().match("no")) {
                    this.stateCur = GameState.QUESTION3;
                    sReply = "Do you have a cough? YES or NO"
                } else {
                    sReply = "You must choose YES or NO";
                }
                break;
            case GameState.QUESTION3:
                if (sInput.toLowerCase().match("yes")) {
                    this.stateCur = GameState.QUESTION4;
                    this.cough = true;
                    sReply = "Do you have shortness of breath? YES or NO"
                } else if (sInput.toLowerCase().match("no")) {
                    this.stateCur = GameState.QUESTION4;
                    sReply = "Do you have shortness of breath? YES or NO"
                } else {
                    sReply = "You must choose YES or NO";
                }
                break;
            case GameState.QUESTION4:
                if (sInput.toLowerCase().match("yes")) {
                    this.stateCur = GameState.QUESTION5;
                    this.shortbreath = true;
                    sReply = "Do you have a sore throat? YES or NO"
                } else if (sInput.toLowerCase().match("no")) {
                    this.stateCur = GameState.QUESTION5;
                    sReply = "Do you have a sore throat? YES or NO"
                } else {
                    sReply = "You must choose YES or NO";
                }
                break;
            case GameState.QUESTION5:
                if (sInput.toLowerCase().match("yes")) {
                    this.stateCur = GameState.QUESTION6;
                    this.sorethroat = true;
                    sReply = "Do you have a runny nose? YES or NO";
                } else if (sInput.toLowerCase().match("no")) {
                    this.stateCur = GameState.QUESTION6;
                    sReply = "Do you have a runny nose? YES or NO";
                } else {
                    sReply = "You must choose YES or NO";
                }
                break;
            case GameState.QUESTION6:
                if (sInput.toLowerCase().match("yes")) {
                    this.stateCur = GameState.SYMPTOMS;
                    this.runnynose = true;
                    sReply = "When did your symptoms start? In the last.. DAY or WEEK or TWO WEEKS";
                } else if (sInput.toLowerCase().match("no")) {
                    if (this.fever || this.cough || this.shortbreath || this.sorethroat) {
                        sReply = "When did your symptoms start? In the last.. DAY or WEEK or TWO WEEKS";
                        this.stateCur = GameState.SYMPTOMS;
                    } else if (this.age > 70) {
                        this.stateCur = GameState.BEGIN;
                        sReply = "Based on your age of " + this.age + " years old, we recommend you get tested. Visit your local testing center as soon as possible. Thank you for using COVID bot.";
                    } else {
                        this.stateCur = GameState.BEGIN;
                        sReply = "We DO NOT recommend you get a COVID-19 test at this time. Please allow for people with symptoms to get tested. If you get symptoms, or have close contact with someone that tested positive for COVID-19, get tested. Thank you for using COVID bot.";
                    }
                } else {
                    sReply = "You must choose YES or NO";
                }
                break;
            case GameState.SYMPTOMS:
                if (sInput.toLowerCase().match("day")) {
                    this.symptomTime = "day";
                    sReply = "Respond to this to see your assessment results.";
                    this.stateCur = GameState.ASSESSMENTRESULT;
                }  else if (sInput.toLowerCase().match("week")) {
                    this.symptomTime = "week";
                    sReply = "Respond to this to see your assessment results.";
                    this.stateCur = GameState.ASSESSMENTRESULT;
                } else if (sInput.toLowerCase().match("two weeks")) {
                    this.symptomTime = "two weeks";
                    sReply = "Respond to this to see your assessment results.";
                    this.stateCur = GameState.ASSESSMENTRESULT;
                } else {
                    sReply = "You must choose DAY or WEEK or TWO WEEKS";
                }
                break;
            case GameState.ASSESSMENTRESULT:
                sReply = "Based on your symptoms of ";
                if(this.fever){
                    sReply = sReply + "-fever "
                }
                if(this.cough){
                    sReply = sReply + "-cough "
                }
                if(this.shortbreath){
                    sReply = sReply + "-shortness of breath "
                }
                if(this.sorethroat){
                    sReply = sReply + "-sore throat "
                }
                if(this.runnynose){
                    sReply = sReply + "-runny nose "
                }
                if(this.headache){
                    sReply = sReply + "-headache "
                }
                sReply = sReply + "that have developed in the last " + this.symptomTime + ". We recommend you get tested. Visit your local testing center as soon as possible. Thank you for using COVID bot."
                this.stateCur = GameState.BEGIN;
                break;
        }
        return ([sReply]);
    }
}