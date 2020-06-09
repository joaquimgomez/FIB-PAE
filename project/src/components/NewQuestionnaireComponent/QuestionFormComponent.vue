<template>
    <el-card style="background-color: #C0B8F5;">
        <el-form>
            <el-row>
                <el-col :span="12">Question {{number}}</el-col>
                <el-col :span="12"><select v-model="type">
                            <option disabled value="">Select a type</option>
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
    export default{
        name:'questionform',
        props: {
            number: Number
        },
        data(){
            return {
                type: "",
                body: "",
                numanswers: 2,
                answers: []
            }
        },
        methods: {
        }
    }
</script>