import {Meteor} from 'meteor/meteor';

import {Keys} from '../../keys/keys';
import {Jobs} from '../../jobs/jobs.js';

import '../../keys/methods';
import '../../jobs/methods';

import {Ajax} from '../../system/server/ajax';

//TODO Пробуем подтянуть работы с каждого ключа и записать в работы.


Meteor.setTimeout(() => {
    for (let key of Keys.find({}).fetch()) {
        //Проверять ключ, если все ок, работаем
        try {
            Meteor.call('keys.update', key, (error, response) => {
                if (error) {
                    throw(error);
                }
                Ajax.getJobs(response.keyID, response.vCode, response.type, response.owner)
                    .then(res => {
                        //Проходим по подтянутым работам и обновляем данные
                        let jobs = res.eveapi.result[0].rowset[0].row;
                        for (let job of jobs) {
                            Meteor.call('jobs.add',job.$);
                        }
                    })
                    .catch(err => {
                        console.log(err.eveapi.error[0]._);
                    })
            });
        } catch (e) {
            console.log(e)
        }
    }
}, 1000);
