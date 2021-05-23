

require.config({
    paths: {
        'jquery': './libs/jquery/dist/jquery.min',
        'knockout': './libs/knockout/knockout-latest',
        'jquery-circle-progress': './libs/jquery-circle-progress/dist/circle-progress'

    }
});

requirejs('knockout', (ko) => {
    ko.applyBindingAccessorsToNode(new AppViewModel())

});
