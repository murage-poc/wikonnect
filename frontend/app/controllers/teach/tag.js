import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TeachTagController extends Controller {
  @inject me;

  @tracked topic_list = ['Literacy', 'STEM', 'Environmental conservation', 'Emotional well-being', 'Life skills and values',
    'Fitness and nutrition', 'Creative arts', 'Community service', 'Learners with special needs', 'Music and movement', 'Entrepreneurship',
    'Health and safety', 'Language Learning']



  @tracked competency_list = [

    'Digital literacy', 'Self efficacy', 'Imagination', 'Creativity', 'Communication', 'Critical thinking', 'Problem solving', 'Collaboration', 'Citizenship', 'Learning to learn'
  ]

  @tracked level_list = [
    'Pre - primary', 'Standard 1', 'Standard 2', 'Standard 3', 'Standard 4', 'Standard 5', 'Standard 6', 'Standard 7', 'Standard 8', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Post - secondary'
  ]

  @tracked platform_list = ['Web', 'Mobile app', 'WhatsApp', 'SMS', 'TV', 'Radio	Print / offline']

  @tracked kicd_list = [
    'APPROVED', 'ALIGNED'
  ]



  @tracked kicd_cart = [];
  @tracked competency_cart = []
  @tracked platform_cart = []
  @tracked topic_cart = []
  @tracked level_cart = []


  @tracked custom_tags = []

  @tracked custom_cart = [];
  @tracked tag;


  @action
  addtag() {
    if (this.tag) {
      this.custom_cart.pushObject(this.tag);
      this.set('tag', '');
    }
  }

  @action
  async updateTags() {
    let id = this.get('model').id;
    let combined = [];

    combined.concat(this.topic_cart);
    combined.concat(this.competency_cart);
    combined.concat(this.level_cart);
    combined.concat(this.custom_cart);
    combined.concat(this.platform_cart);


    let chapter = await this.store.findRecord('chapter', id);
    chapter.set('tags', combined);
    chapter.save();
    this.transitionToRoute('teach.preview', id);

  }

  @action
  removetag(item) {
    this.tags.removeObject(item);

  }

  @action
  addme(item, cart) {
    switch (cart) {
    case 'competency':
      this.competency_list.removeObject(item);
      this.competency_cart.addObject(item);
      break;
    case 'topic':
      this.topic_list.removeObject(item);
      this.topic_cart.addObject(item);
      break;
    case 'level':
      this.level_list.removeObject(item);
      this.level_cart.addObject(item);
      break;
    case 'platform':
      this.platform_list.removeObject(item);
      this.platform_cart.addObject(item);
      break;

    case 'kicd':
      this.kicd_list.removeObject(item);
      this.kicd_cart.addObject(item);
      break;

    default:
      break;
    }


  }

  @action
  removeme(item, cart) {
    switch (cart) {
    case 'competency':
      this.competency_cart.removeObject(item);
      this.competency_list.addObject(item);
      break;
    case 'topic':
      this.topic_cart.removeObject(item);
      this.topic_list.addObject(item);
      break;
    case 'level':
      this.level_cart.removeObject(item);
      this.level_list.addObject(item);
      break;
    case 'platform':
      this.platform_cart.removeObject(item);
      this.platform_list.addObject(item);
      break;
    case 'kicd':
      this.kicd_cart.removeObject(item);
      this.kicd_list.addObject(item);
      break;
    case 'custom':
      this.custom_cart.removeObject(item);
      break;

    default:
      break;
    }
  }

}
