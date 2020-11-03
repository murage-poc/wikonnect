import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';




export default class MainHeaderClassicComponent extends Component {

    @service
    me;


    @service router;
    @service session;


    @tracked token = this.session.data.authenticated.token




    @action
    logoutuser() {

        this.me.logout();
        document.location.reload();

        this.router.transitionTo('home');


    }


}
