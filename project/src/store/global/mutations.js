

export default {
    /**
     * Summary. Change state loading
     * 
     * @param {Object}  state   vuex state
     * @param {boolean} status  status for property
     * 
     */
    loadApp(state, data)
    {
        state.id_questionnaire = data;        
    },


};
