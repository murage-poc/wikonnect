import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class EditRoleComponent extends Component {
  @service session;
  @service notify;
  @service store;

  get roles() {
    return this.args.roles;
  }

  @action
  async changeRole(role) {
    const userId = this.args.user.id;

    const data = {
      userRole: {
        groupId: role.id,
      },
    };
    try {
      const res = await fetch(`/api/v1/userRole/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${this.session?.data?.authenticated?.token}`,
        },
      });

      if (!res.ok) {
        throw res;
      }
      const payload = await res.json();
      const groupId = payload.user_role[0].groupId;
      console.log(groupId);

      if (!groupId) {
        return;
      }

      const group = this.store.peekRecord('group', groupId);
      const user = this.store.peekRecord('user', userId);
      user.userRoles = [group];
    } catch (e) {
      let message = 'Unexpected error encountered';
      if (e.status === 400) {
        message = 'User account associated with that email not found';
      }
      this.notify.error(message, { closeAfter: 20000 });
    }
  }
}
