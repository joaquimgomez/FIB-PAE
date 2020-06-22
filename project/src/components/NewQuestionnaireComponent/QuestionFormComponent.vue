<template>
    <el-card :style="cssProps">
        <el-form>
            <el-row>
                <el-col :span="12">Question {{number}}</el-col>
                <el-col :span="12">
                        <el-select v-model="type" placeholder="Type">
                            <el-option
                                v-for="o in options" v-bind:key="o.value" :value="o.value" :label="o.value" >
                            </el-option>
                        </el-select>
                </el-col>
            </el-row>
            <br>
            <el-row>
                <el-input v-model="body" placeholder="Question body"></el-input>
            </el-row>
            <div v-if="type === 'Checkbox'">
                <br>
                <el-row>
                    <el-col :span="12">Number of options</el-col>
                    <el-col :span="12"><el-input-number v-model="numanswers" :min="2"></el-input-number></el-col>
                </el-row>
                <div v-for="n in numanswers" v-bind:key="n">
                    <el-row>
                        <br>
                        <el-col :span="6">Option {{n}}</el-col>
                        <el-col :span="18"><el-input v-model="answers[n-1]"></el-input></el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
    </el-card>
</template>

<script>

    import axios from 'axios'

    var green = "#9AEEAA";
    var red = "#B53737";

    export default{
        name:'questionform',
        props: {
            number: Number,
            send: Number,
            id: Number
        },
        data(){
            return {
                type: "",
                body: null,
                numanswers: 2,
                answers: [],
                sent: false,
                color: '#C0B8F5',
                options: [{
                    value: 'Regular'
                },
                {
                    value: 'Checkbox'
                }]
            }
        },
        methods: {
            launchNotify(title, message, type) {
                this.$notify({
                    title: title,
                    message: message,
                    type: type
                });
            },
            check(){

                if (this.type == "" || this.body == null){ 
                    this.launchNotify('Error', 'Question ' + this.number + ' does not have type or body.', 'error');
                    this.color = red;
                    return false;
                }
                if (this.type == 'Checkbox'){
                    for (var a in this.answers){
                        if (a == null){
                            this.launchNotify('Error', 'Question ' + this.number + ' does have an empty option.', 'error');
                            this.color = red;
                            return false;
                        }
                    }
                    
                    if (this.answers.length != this.numanswers){
                        this.launchNotify('Error', 'Question ' + this.number + ' does have an empty option.', 'error');
                        this.color = red;
                        return false;
                    }
                }
                return true;
            },
            postQuestion(){

                var url = "http://localhost:3000/question/poll/" + this.id;
                var defined = 0;
                if (this.type == 'Checkbox') defined = 1;

                var answ = [];

                for (var a in this.answers){
                    var concrete = {
                        id: parseInt(a),
                        body: this.answers[a],
                        image: null
                    }
                    answ.push(concrete);
                }

                var question = {
                    id: this.number,
                    body: this.body,
                    defined_answers: defined,
                    answers: answ
                }

                axios.post(url, question)
                    .then(response => {
                        console.log("POST QUESTION " + this.number + " OK", response);
                        this.color = green;
                        this.sent = true;
                    })
                    .catch(error => {
                        this.launchNotify("Error", "Error while posting question " + this.number, 'error');
                        console.log(error);
                    })
                

                //console.log('sent question ' + this.number);
            }

        },
        watch: {
            send: function() {
                if (!this.sent){
                    console.log('1');
                    if (this.check()){
                        this.postQuestion();
                        //send
                    }
                }
                
            }
        },
        computed: {
            cssProps(){
                return {
                    '--color': this.color
                }
            }
        }
    }
</script>

<style>
    .el-card {
        background-color: var(--color);
    }
    .el-input-number{
        width: fit-content;
    }
</style>