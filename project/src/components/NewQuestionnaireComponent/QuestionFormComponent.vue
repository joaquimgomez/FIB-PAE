<template>
    <el-card :style="cssProps">
        <el-form>
            <el-row>
                <el-col :span="12">Question {{number}}</el-col>
                <el-col :span="12"><select v-model="type">
                            <option disabled value="Select a type">Select a type</option>
                            <option>Regular</option>
                            <option>Checkbox</option>
                        </select>
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
                        <el-col :span="8">Option {{n}}</el-col>
                        <el-col :span="16"><el-input v-model="answers[n-1]"></el-input></el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
    </el-card>
</template>

<script>

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
                color: '#C0B8F5'
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

            }
        },
        watch: {
            send: function() {
                if (!this.sent){
                    console.log('1');
                    if (this.check()){
                        this.sent = true;
                        this.color = green;
                        console.log(this.color);
                        console.log('sent question ' + this.number);
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
</style>