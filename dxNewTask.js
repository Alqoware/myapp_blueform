const task_types = [{Nazwa: 'zadanie', Id: -1, Ikona: 'fa fa-list-ul'}, {Nazwa: 'lista zadań', Id: -2, Ikona: 'fa fa-list-ul'}, {Nazwa: 'formularz', Id: -3, Ikona: 'fas fa-list-alt'}]
var createUserStore = function(all) {
  return new DevExpress.data.CustomStore({
    loadMode: 'raw',
    key: 'Id',
    load: function(loadOptions) {
      const deferred = new $.Deferred
      $.post('/crm/crm_users', function(d) {
        if (all) {
          d.unshift({id: -3, nazwa: 'grupowe (wielu wykonawców)'})
          d.unshift({id: -1, nazwa: 'nieprzypisany (do wzięcia)'})
          d.unshift({id: -2, nazwa: 'właściciel'})
        }
        deferred.resolve(d)
      })
      return deferred.promise()
    },
    byKey: function(key) {
      const deferred = new $.Deferred
      if (key == -2)
      return {id: -2, nazwa: 'właściciel'}
      if (key == -1)
      return {id: -1, nazwa: 'nieprzypisany (do wzięcia)'}
      if (key == -3)
      return {id: -3, nazwa: 'grupowe (wielu wykonawców)'}
      $.post('/crm/crm_users', function(d) {
        if (all) {
          d.unshift({id: -3, nazwa: 'grupowe (wielu wykonawców)'})
          d.unshift({id: -1, nazwa: 'nieprzypisany (do wzięcia)'})
          d.unshift({id: -2, nazwa: 'właściciel'})
        }
        var item = d.find(x => x.id == key)
        deferred.resolve(item || {})
      })
      return deferred.promise()
    }
  })
}
var taskUsersDataSource = new DevExpress.data.DataSource({
  store: createUserStore(true),
  onChanged() {}
})
var taskUsersAccessDataSource = new DevExpress.data.DataSource({
  store: createUserStore(),
  onChanged() {}
})
var taskDepsAccessDataStore = new DevExpress.data.CustomStore({
  key: 'Id',
  load: function(loadOptions) {
    const deferred = new $.Deferred
    $.post('/crm/load_deps', function(d) {
      deferred.resolve(d)
    })
    return deferred.promise()
  },
  byKey: function(key) {
    if (!key)
    return {}
    const deferred = new $.Deferred
    $.post('/crm/load_deps', function(d) {
      var item = d.find(x => x.Id == key)
      deferred.resolve(item || {})
    })
    return deferred.promise()
  }
})
var taskDepsAccessDataSource = new DevExpress.data.DataSource({
  store: taskDepsAccessDataStore
})
var taskContactsDataStore = new DevExpress.data.CustomStore({
  key: 'ID',
  loadMode: 'raw',
  load: function(loadOptions) {
    const deferred = new $.Deferred
    var formEl = typeof task_summary != 'undefined' && task_summary.active ? $('#form-task-summary').dxForm('instance') : $('#form-create-event').dxForm('instance')
    if (!formEl) return []
    var id = formEl.option('formData').df_contractor
    $.post('/crm/client_contacts', {id: id}, function(d) {
      deferred.resolve(d)
    })
    return deferred.promise()
  },
  byKey: function(key) {
    if (!key)
    return {}
    const deferred = new $.Deferred
    $.post('/crm/client_contacts', {contact: key}, function(d) {
      var item = d.find(x => x.ID == key)
      deferred.resolve(item || {})
    })
    return deferred.promise()
  }
})
var taskContactsDataSource = new DevExpress.data.DataSource({
  store: taskContactsDataStore
})
var taskFormsDataStore = new DevExpress.data.CustomStore({
  key: 'Id',
  loadMode: 'raw',
  load: function(loadOptions) {
    const deferred = new $.Deferred
    $.post('/crm/form_list', function(d) {
      deferred.resolve(d)
    })
    return deferred
  },
  byKey: function(key) {
    if (!key)
    return {}
    const deferred = new $.Deferred
    $.post('/crm/form_list', {id: key}, function(d) {
      deferred.resolve(d[0])
    })
    return deferred
  }
})
var taskFormsDataSource = new DevExpress.data.DataSource({
  store: taskFormsDataStore
})
var taskCategoryDataStore = new DevExpress.data.CustomStore({
  key: 'nazwa',
  load: function(loadOptions) {
    const deferred = new $.Deferred
    $.post('/crm/api/task_categories', {module: 'crm'}, function(d) {
      deferred.resolve(d)
    })
    return deferred.promise()
  }
})
var taskCategoryDataSource = new DevExpress.data.DataSource({
  store: taskCategoryDataStore,
  onChanged() {}
})
var taskTypesDataStore = new DevExpress.data.CustomStore({
  key: 'Id',
  loadMode: 'raw',
  load: function(loadOptions) {
    var formEl = $('#form-create-event').dxForm('instance')
    var task_summary_active = typeof task_summary != 'undefined' && task_summary.active
    var allDay = formEl ? formEl.getEditor('df_allDay').option('value') : false
    if (allDay && !task_summary_active) return task_types
    const deferred = new $.Deferred
    $.post('/crm/contact_types', function(d) {
      deferred.resolve(d)
    })
    return deferred.promise()
  },
  byKey: function(key) {
    if (!key)
    return {}
    var formEl = $('#form-create-event').dxForm('instance'),
    allDay = false
    if (formEl)
    allDay = formEl.getEditor('df_allDay').option('value')
    if (allDay || key < 0) return task_types.find(x => x.Id == key) || {}
    const deferred = new $.Deferred
    $.post('/crm/contact_types', function(d) {
      var item = d.find(x => x.Id == key)
      deferred.resolve(item || {})
    })
    return deferred.promise()
  }
})
var taskTypesDataSource = new DevExpress.data.DataSource({
  store: taskTypesDataStore,
  onChanged(){}
})
var taskClientsDataStore = new DevExpress.data.CustomStore({
  key: 'ID',
  byKey: function(key) {
    var d = new $.Deferred
    $.post('/crm/crm_client', {id: key, all: true}, function(data) {
      d.resolve(data)
    })
    return d.promise()
  },
  load: function(loadOptions) {
    const deferred = $.Deferred()
    $.post('/crm/crm_filterClients', {all: true}, function(d) {
      deferred.resolve(d.clients)
    })
    return deferred.promise()
  }
})
var taskClientsDataSource = new DevExpress.data.DataSource({
  store: taskClientsDataStore,
  onChanged(){},
})
var getTasksOptions = function(tasks) {
  const options = [];
    for (let i = 0; i < tasks.length; i += 1) {
      options.push(new_task_dialog.task_item(i));
    }
    return options;
}
var dataGrid
var new_task_dialog = {
  task_list: [],
  interval_preview: function() {
    var form = $('#form-create-event').dxForm('instance'),
    data = form.option('formData'),
    dialog = $('#interval_preview_dialog'),
    task = {
      interval: data.df_interval,
      interval_from: moment(data.df_interval_from).format('HH:mm'),
      interval_to: moment(data.df_interval_to).format('HH:mm'),
      interval_days: [],
      date: data.df_dateFrom
    }
    task.date = moment(task.date, 'YYYY.MM.DD HH:mm').format()
    for (var i = 0; i < 7; i++) {
      if (data[`df_interval_${i}`])
      task.interval_days.push(i)
    }
    task.clients = data.df_contractors
    $.post('/crm/contacts_interval_preview', task, function(d) {
      var html = ''
      // if (d.error) {
      //   return $('.errors', '#plan_contact_dialog').html('<div class="alert alert-danger">'+d.error+'</div>')
      // }
      for (var i = 0; i < d.length; i++) {
        var nazwa = d[i].Nazwa
        if (d[i].Os_fizyczna) {
          nazwa = d[i].Nazwisko || ''
          if (d[i].Imie)
          nazwa += ' ' + d[i].Imie
          if (nazwa.trim() == '')
          nazwa = d[i].Nazwa
        }
        html += '<tr><td>'+nazwa+'</td><td>'+moment(d[i].Data).format('YYYY.MM.DD HH:mm')+'</td>'
        html += '<td class="text-center"><button class="btn btn-default remove-interval" data-index="'+i+'"><span class="glyphicon glyphicon-remove"></span></button></td>'
        html += '</tr>'
      }
      $('.table tbody', dialog).html(html)
      dialog.dialog('open')
      $('[aria-describedby="interval_preview_dialog"]').css('z-index', 1502)
    })
  },
  task_item: function(index) {
    return {
        label: {
            text: 'Treść'
        },
        colSpan: 3,
        dataField: `df_tasks[${index}]`,
        editorOptions: {
            label: 'Treść',
            labelMode: 'floating',
            buttons: [{
              name: 'trash',
              location: 'after',
              options: {
                stylingMode: 'text',
                icon: 'trash',
                onClick(e) {
                  new_task_dialog.task_list.splice(index, 1)
                  const form = $('#form-create-event').dxForm('instance')
                  var data = form.option('formData')
                  data.df_tasks.splice(index, 1)
                  $('#form-create-event').dxForm('instance').itemOption('leftGroup.topicGroup.tasks-container.task_list', 'items', getTasksOptions(new_task_dialog.task_list));
                },
              },
            }]
        },
    }
  },
  formItems: function(data) {
    new_task_dialog.task_list = data.df_tasks
    var interval_items = []
    var interval_days = []
    var days = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']
    days.forEach((d, i) => {
      interval_days.push({
        editorType: 'dxCheckBox',
        label: {
          visible: false
        },
        cssClass: i == 0 ? 'padding-left' : null,
        dataField: `df_interval_${i}`,
        editorOptions: {
          value: i < 5 ? true : false,
          text: d
        }
      })
    })
    if (data.interval)
    interval_items = [
      {
        itemType: 'group',
        colCount: 4,
        items: [
          {
            label: {
              text: 'Odstęp w minutach'
            },
            colSpan: 1,
            editorType: 'dxNumberBox',
            dataField: 'df_interval',
            editorOptions: {
              min: 0,
              width: 120,
              labelMode: 'floating',
              value: 15
            }
          },          
          {
            colSpan: 1,
            label: {
              text: 'Od'
            },
            editorType: 'dxDateBox',
            dataField: 'df_interval_from',
            editorOptions: {
              // width: '120px',
              displayFormat: 'HH:mm',
              type: 'time',
              value: moment().hour(8).minute(0).toDate()
            }
          },
          {
            colSpan: 1,
            label: {
              text: 'Do'
            },
            editorType: 'dxDateBox',
            dataField: 'df_interval_to',
            editorOptions: {
              // width: '120px',
              displayFormat: 'HH:mm',
              type: 'time',
              value: moment().hour(16).minute(0).toDate()
            }
          },
          {
            colSpan: 1,
            itemType: 'button',
            name: 'df_interval_preview',
            buttonOptions: {
              text: 'Podgląd',
              // type: ''
              onClick: new_task_dialog.interval_preview
            }
          },
        ]
      },
      {
        itemType: 'group',
        name: 'daysGroup',
        colspan: 3,
        colCount: 7,
        items: interval_days
      }
    ]
    
    data.df_performer = parseInt(data.df_performer)
    var companies = JSON.parse(localStorage.getItem('companies') || '[]')
    return [
      {
        itemType: 'group',
        name: 'leftGroup',
        colSpan: 7,
        items: [
          {
            itemType: 'group',
            name: 'companyGroup',
            visible: !!companies.length || companies.length == 1,
            items: [
              {
                label: {
                    text: 'Firma'
                },
                colSpan: 2,
                dataField: 'companySelect',
                editorType: 'dxSelectBox',

                editorOptions: {
                  width: 300,
                    displayExpr: 'name',
                    valueExpr: 'id',
                    value: data.company,
                    onValueChanged(e) {
                      localStorage.setItem('cid', e.value)
                      let formEl = $('#form-create-event').dxForm('instance')
                      if (typeof firmotronNotifications != 'undefined')
                      firmotronNotifications.showLoading()
                      $.post('/license/module/check', {modul: 'crm', userid: true, cid: e.value}, function(d) {
                        formEl.beginUpdate()
                        formEl.updateData({'df_contact_person': null, 'df_contractor': null, 'df_performer': -2})
                        if (d.success) {
                          formEl.updateData({only_events: false})                          
                        } else {
                          formEl.updateData({only_events: true})
                        }
                        formEl.endUpdate()
                        taskUsersAccessDataSource.reload()
                        if (d.success) {
                          taskContactsDataSource.reload()
                          taskUsersDataSource.reload()
                            taskDepsAccessDataSource.reload()
                            taskFormsDataSource.reload()
                            taskCategoryDataSource.reload()
                            taskTypesDataSource.reload()
                            taskClientsDataSource.reload()
                        }
                        if (typeof firmotronNotifications != 'undefined')
                        firmotronNotifications.hideLoading()
                      })                      
                    },
                    dataSource: new DevExpress.data.ArrayStore({
                        data: companies,
                        key: 'id',
                    }),
                },
            }, 
            ]
          },
          {
            itemType: 'group',
            name: 'checkboxGroup',
            colspan: 7,
            colCount: 2,
            items: [
              {
                colSpan: 2,
                dataField: 'df_hash',
                editorType: 'dxTextBox',
                editorOptions: {
                  value: data.df_hash
                },
                visible: false,
              },
              {
                dataField: 'df_contractors',
                editorType: 'dxTextBox',
                editorOptions: {
                  value: data.df_contractors,
                },
                visible: false
              },       
              {
                colSpan: 1,
                label: {
                    text: 'Całodniowe'
                },
                dataField: 'df_allDay',
                editorType: 'dxCheckBox',
                editorOptions: {
                    // value: false,
                    value: data.df_allDay,
                    width: 'auto',
                    disabled: !!data.df_id || !!data.interval || !!data.df_mainTask || !!data.df_action_only,
                    onValueChanged(e) {
                      let formEl = $('#form-create-event').dxForm('instance')
                      // if (e.value)
                      // formEl.getEditor('df_duration').option('label', 'Czas trwania (dni)')
                      // else
                      // formEl.getEditor('df_duration').option('label', 'Czas trwania (min)')
                      taskTypesDataSource.reload()
                    }
                },
              },
              {
                colSpan: 2,
                dataField: 'df_series',
                label: {
                  text: 'Edytuj serię'
                },
                editorType: 'dxCheckBox',
                editorOptions: {
                  value: data.df_series
                },
                visible: !!data.df_series
              },
              {
                colspan: 1,
                itemType: 'button',
                name: 'df_register_action',
                visible: !companies.length && !data.df_mainTask,
                buttonOptions: {
                  text: 'Rejestruj działanie',
                  icon: 'fas fa-play',
                  type: 'success',
                  visible: !data.df_id,
                  onClick: function() {
                    var form = $('#form-create-event').dxForm('instance'),
                    data = form.option('formData')
                    var _data = {
                      df_contractor: data.df_contractor,
                      opis: 'Działanie rejestrowane w czasie rzeczywistym',
                      df_contact_type: 1,
                      df_contact_person: data.df_contact_person,
                      df_dateFrom: moment().format(),
                      df_dateTo: moment().format(),
                      register: true,
                      df_block_client: data.df_block_client,
                      df_cdr: data.df_cdr,
                      df_chance: data.df_chance,
                      df_chance_percent: data.df_chance_percent,
                      df_chance_field: data.df_chance_field
                    }
                    $("#add_task_dialog").dxPopup("instance").hide()
                    task_summary.init({data: _data})
                  }
                }
              },
            ]
          },
          {
            itemType: 'group',
            name: 'taskGroup',
            // visible: !data.df_block_cycle,
            // caption: 'Działanie',
            colSpan: 7,
            colCount: 14,
            items: [
              {
                dataField: 'df_dateFrom',
                colSpan: 6,
                validationRules: [
                  {type: 'custom',
                  message: 'Nieprawidłowa data rozpoczęcia',
                  reevaluate: true,
                  validationCallback: function(e) {
                    var form = $('#form-create-event').dxForm('instance'),
                    data = form.option('formData')
                    // if (!data.df_dateTo || !data.df_endDate)
                    // return true
                    return moment(data.df_dateFrom).isSameOrBefore(data.df_dateTo)
                  }}
                ],
                template: function(comp_data, itemElement) {
                  itemElement.append( $("<div id='dateBoxFrom'>")
                  .dxDateBox({
                      displayFormat: 'yyyy.MM.dd',
                      label: 'Data rozpoczęcia',
                      labelMode: 'floating',
                      type: 'date',
                      // value: new Date(),
                      width: 138,
                      height: 34,
                      onValueChanged: function(e) {
                          var timeCont = $('#dateBoxTimeFrom').dxDateBox('instance'),
                          time = moment(timeCont.option('value'))
                          var date = moment(e.value).hour(time.hour()).minute(time.minute())
                          comp_data.component.updateData(comp_data.dataField, date.toDate());
                      },
                      onInitialized: function(e) {
                        var formData = comp_data.component.option('formData'),
                        now = new Date()
                        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30)
                        var date = formData && formData.df_dateFrom ? moment(formData.df_dateFrom).toDate() : now
                        e.component.option('value', date)
                        comp_data.component.updateData(comp_data.dataField, date)
                      }
                  })
                  )
                  itemElement.append( $("<div id='dateBoxTimeFrom'>")
                  .dxDateBox({
                      displayFormat: 'HH:mm',
                      type: 'time',
                      // value: new Date(),
                      width: 80,
                      height: 34,
                      visible: !data.df_allDay,
                      onOpened(e) {
                        var list = e.component.content().find('.dx-list').dxList('instance'),
                        items = list.option('items'),
                        val = moment(e.component.option('value')).toDate()
                        val.setMinutes(Math.ceil(val.getMinutes() / 30) * 30)
                        var found = 0
                        items.forEach((x, index) => {
                          if (moment(x).isSame(moment(val), 'm'))
                          found = index
                        })
                        found += 4
                        list.scrollToItem(found > 47 ? 47 : found)
                      },
                      onValueChanged: function(e) {
                        var dateCont = $('#dateBoxFrom').dxDateBox('instance'),
                        date = moment(dateCont.option('value')),
                        time = moment(e.value)
                        var d = date.hour(time.hour()).minute(time.minute())
                        comp_data.component.updateData(comp_data.dataField, d.toDate());
                      },
                      onInitialized: function(e) {
                        var formData = comp_data.component.option('formData')
                        var now = new Date()
                        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30)
                        var date = formData && formData.df_dateFrom ? moment(formData.df_dateFrom).toDate() : now
                        e.component.option('value', date)
                        comp_data.component.updateData(comp_data.dataField, date)
                      }
                  })
                  )
                  if (!data.df_block_cycle && !data.df_id && !data.df_mainTask)
                  itemElement.append($('<div id="task-cycle-button">')
                  .dxButton({
                    icon: 'fas fa-sync-alt',
                    type: 'cycle',
                    onContentReady(e) {
                      $(e.element).css({'margin-top': '-1px', 'height': '34px'})
                    },
                    onClick(e) {
                      let formEl = $('#form-create-event').dxForm('instance')
                      var data = formEl.option('formData')
                      formEl.itemOption('leftGroup.cycleGroup', 'visible', !data.df_cycle)
                      formEl.updateData({df_cycle: !data.df_cycle})
                    }
                  })
                  )
                }
              },
              {
                label: {
                    text: data.df_allDay ? 'Czas trwania (dni)' : 'Czas trwania (min)'
                },
                colSpan: 3,
                name: 'df_duration',
                cssClass: 'no-padding-item',
                visible: false,
                // rowSpan: 4,
                editorType: 'dxNumberBox',
                dataField: 'df_duration',
                editorOptions: {
                    width: 120,
                    min: 0,
                    labelMode: 'floating'
                },
            },
              {
                colSpan: 6,
                name: 'dateEnd',
                dataField: 'df_dateTo',
                // visible: !!data.df_allDay || !!data.df_endDate,
                template: function(comp_data, itemElement) {
                  itemElement.append( $("<div id='dateBoxTo'>")
                  .dxDateBox({
                      displayFormat: 'yyyy.MM.dd',
                      label: 'Data zakończenia',
                      labelMode: 'floating',
                      type: 'date',
                      height: 34,
                      width: 138,
                      onValueChanged: function(e) {
                        var timeCont = $('#dateBoxTimeTo').dxDateBox('instance'),
                        time = moment(timeCont.option('value'))
                        var date = moment(e.value).hour(time.hour()).minute(time.minute())
                        comp_data.component.updateData(comp_data.dataField, date.toDate());
                      },
                      onInitialized: function(e) {
                        var formData = comp_data.component.option('formData'),
                        now = new Date()
                        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30)
                        var date = formData && formData.df_dateTo ? moment(formData.df_dateTo).toDate() : moment(now).add(30, 'm').toDate()
                        e.component.option('value', date)
                        comp_data.component.updateData(comp_data.dataField, date)
                      }
                  })
                  )
                  itemElement.append( $("<div id='dateBoxTimeTo'>")
                  .dxDateBox({
                      displayFormat: 'HH:mm',
                      type: 'time',
                      // value: moment().add(30, 'm').toDate(),
                      width: 80,
                      height: 34,
                      visible: !data.df_allDay,
                      onOpened(e) {
                        var list = e.component.content().find('.dx-list').dxList('instance'),
                        items = list.option('items'),
                        val = moment(e.component.option('value')).toDate()
                        val.setMinutes(Math.ceil(val.getMinutes() / 30) * 30)
                        var found = 0
                        items.forEach((x, index) => {
                          if (moment(x).isSame(moment(val), 'm'))
                          found = index
                        })
                        found += 4
                        list.scrollToItem(found > 47 ? 47 : found)
                      },
                      onValueChanged: function(e) {
                        var dateCont = $('#dateBoxTo').dxDateBox('instance'),
                        date = moment(dateCont.option('value')),
                        time = moment(e.value)
                        var d = date.hour(time.hour()).minute(time.minute())
                        comp_data.component.updateData(comp_data.dataField, d.toDate());
                      },
                      onInitialized: function(e) {
                        var formData = comp_data.component.option('formData'),
                        now = new Date()
                        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30)
                        var date = formData && formData.df_dateTo ? moment(formData.df_dateTo).toDate() : moment(now).add(30, 'm').toDate()
                        e.component.option('value', date)
                        comp_data.component.updateData(comp_data.dataField, date)
                      }
                  })
                  )
                }
              },   
            ]
        },
        {
          itemType: 'group',
          name: 'doneGroup',
          cssClass: 'interval-group',
          visible: !!data.df_edit_dates,
          colCount: 14,
          items: [
            {
              colSpan: 14,
              template: function(comp_data, itemElement) {
                itemElement.append($('<span>Edycja daty wykonania</span>'))
              }
            },
            {
              dataField: 'df_startDate',
              colSpan: 6,
              template: function(comp_data, itemElement) {
                itemElement.append( $("<div id='dateBoxStart'>")
                .dxDateBox({
                    displayFormat: 'yyyy.MM.dd',
                    label: 'Data rozpoczęcia',
                    labelMode: 'floating',
                    type: 'date',
                    // value: new Date(),
                    width: 138,
                    height: 34,
                    onValueChanged: function(e) {
                        var timeCont = $('#dateBoxTimeStart').dxDateBox('instance'),
                        time = moment(timeCont.option('value'))
                        var date = moment(e.value).hour(time.hour()).minute(time.minute())
                        comp_data.component.updateData(comp_data.dataField, date.toDate());
                    },
                    onInitialized: function(e) {
                      var formData = comp_data.component.option('formData'),
                      now = new Date()
                      now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30)
                      var date = formData && formData.df_startDate ? moment(formData.df_startDate).toDate() : now
                      e.component.option('value', date)
                      comp_data.component.updateData(comp_data.dataField, date)
                    }
                })
                )
                itemElement.append( $("<div id='dateBoxTimeStart'>")
                .dxDateBox({
                    displayFormat: 'HH:mm',
                    type: 'time',
                    // value: new Date(),
                    width: 80,
                    height: 34,
                    onOpened(e) {
                      var list = e.component.content().find('.dx-list').dxList('instance'),
                      items = list.option('items'),
                      val = moment(e.component.option('value')).toDate()
                      val.setMinutes(Math.ceil(val.getMinutes() / 30) * 30)
                      var found = 0
                      items.forEach((x, index) => {
                        if (moment(x).isSame(moment(val), 'm'))
                        found = index
                      })
                      found += 4
                      list.scrollToItem(found > 47 ? 47 : found)
                    },
                    onValueChanged: function(e) {
                      var dateCont = $('#dateBoxStart').dxDateBox('instance'),
                      date = moment(dateCont.option('value')),
                      time = moment(e.value)
                      var d = date.hour(time.hour()).minute(time.minute())
                      comp_data.component.updateData(comp_data.dataField, d.toDate());
                    },
                    onInitialized: function(e) {
                      var formData = comp_data.component.option('formData')
                      var now = new Date()
                      now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30)
                      var date = formData && formData.df_startDate ? moment(formData.df_startDate).toDate() : now
                      e.component.option('value', date)
                      comp_data.component.updateData(comp_data.dataField, date)
                    }
                })
                )
              }
            },
            {
              dataField: 'df_taskEndDate',
              colSpan: 6,
              template: function(comp_data, itemElement) {
                  itemElement.append( $("<div id='dateBoxEnd'>")
                  .dxDateBox({
                      displayFormat: 'yyyy.MM.dd',
                      label: 'Data zakończenia',
                      labelMode: 'floating',
                      type: 'date',
                      height: 34,
                      width: 138,
                      onValueChanged: function(e) {
                        var timeCont = $('#dateBoxTimeEnd').dxDateBox('instance'),
                        time = moment(timeCont.option('value'))
                        var date = moment(e.value).hour(time.hour()).minute(time.minute())
                        comp_data.component.updateData(comp_data.dataField, date.toDate());
                      },
                      onInitialized: function(e) {
                        var formData = comp_data.component.option('formData'),
                        now = new Date()
                        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30)
                        var date = formData && formData.df_taskEndDate ? moment(formData.df_taskEndDate).toDate() : moment(now).add(30, 'm').toDate()
                        e.component.option('value', date)
                        comp_data.component.updateData(comp_data.dataField, date)
                      }
                  })
                  )
                  itemElement.append( $("<div id='dateBoxTimeEnd'>")
                  .dxDateBox({
                      displayFormat: 'HH:mm',
                      type: 'time',
                      // value: moment().add(30, 'm').toDate(),
                      width: 80,
                      height: 34,
                      onOpened(e) {
                        var list = e.component.content().find('.dx-list').dxList('instance'),
                        items = list.option('items'),
                        val = moment(e.component.option('value')).toDate()
                        val.setMinutes(Math.ceil(val.getMinutes() / 30) * 30)
                        var found = 0
                        items.forEach((x, index) => {
                          if (moment(x).isSame(moment(val), 'm'))
                          found = index
                        })
                        found += 4
                        list.scrollToItem(found > 47 ? 47 : found)
                      },
                      onValueChanged: function(e) {
                        var dateCont = $('#dateBoxEnd').dxDateBox('instance'),
                        date = moment(dateCont.option('value')),
                        time = moment(e.value)
                        var d = date.hour(time.hour()).minute(time.minute())
                        comp_data.component.updateData(comp_data.dataField, d.toDate());
                      },
                      onInitialized: function(e) {
                        var formData = comp_data.component.option('formData'),
                        now = new Date()
                        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30)
                        var date = formData && formData.df_taskEndDate ? moment(formData.df_taskEndDate).toDate() : moment(now).add(30, 'm').toDate()
                        e.component.option('value', date)
                        comp_data.component.updateData(comp_data.dataField, date)
                      }
                  })
                  )
            }
          },
          {
            itemType: 'empty',
            colSpan: 2
          },
          {
            colSpan: 14,
            template: function(comp_data, itemElement) {
              itemElement.append($('<span>Edycja czasu wykonania</span>'))
            }
          },
          {
            colSpan: 3,
            dataField: 'df_timeHours',
            editorType: 'dxNumberBox',
            label: {
              text: 'Godziny'
            },
            editorOptions: {
              min: 0
            }
          },
          {
            colSpan: 3,
            dataField: 'df_timeMinutes',
            editorType: 'dxNumberBox',
            label: {
              text: 'Minuty'
            },
            editorOptions: {
              max: 59,
              min: 0
            }
          }
          ]
        },
        {
          itemType: 'group',
          name: 'cycleGroup',
          visible: !!data.df_block_cycle,
          cssClass: 'interval-group',
          colCount: 2,
          items: [
            {
              itemType: 'group',
              name: 'cycleDateGroup',
              items: [
                {
                  label: {
                    text: 'Od'
                  },
                  dataField: 'df_cycleStart',
                  colSpan: 1,
                  editorType: 'dxDateBox',
                  editorOptions: {
                    type: 'date',
                    displayFormat: 'yyyy.MM.dd',
                  }
                },
                {
                  label: {
                    text: 'Do'
                  },
                  colSpan: 1,
                  dataField: 'df_cycleEnd',
                  editorType: 'dxDateBox',
                  editorOptions: {
                    type: 'date',
                    displayFormat: 'yyyy.MM.dd'
                  }
                }
              ]
            },
            {
              itemType: 'group',
              items: [
                {
                  label: {
                    text: `Cykliczność`
                  },
                  editorType: 'dxRadioGroup',
                  dataField: 'df_cycleType',
                  editorOptions: {
                    valueExpr: 'id',
                    value: data.df_cycle_type || 'day',
                    layout: 'horizontal',
                    items: [
                      {
                        id: 'day',
                        text: 'w dniach'
                      },
                      {
                        id: 'month',
                        text: 'w miesiącach'
                      }
                    ]
                  }
                },
                {
                  label: {
                    text: 'Interwał'
                  },
                  editorType: 'dxNumberBox',
                  dataField: 'df_cycleAmount',
                  editorOptions: {
                    value: data.df_cycle_amount || 1,
                    min: 1
                  }
                },
                {
                  label: {
                    text: 'Z wyprzedzeniem (dni)'
                  },
                  editorType: 'dxNumberBox',
                  dataField: 'df_inAdvance',
                  editorOptions: {
                    value: data.df_inAdvance,
                    min: 0
                  }
                },
              ]
            }            
            // {
            //   label: {
            //     text: 'Bezterminowo'
            //   },
            //   editorType: 'dxCheckBox',
            //   editorOptions: {
            //     value: false
            //   }
            // }
          ]
        },
        {
          itemType: 'group',
          colSpan: 3,
          // visible: !data.df_block_cycle,
          colCount: 2,
          items: [
            // {
            //   name: 'endDateCheckbox',
            //   editorType: 'dxCheckBox',
            //   label: {
            //     visible: false
            //   },
            //   visible: !data.df_allDay,
            //   dataField: 'df_endDate',
            //   editorOptions: {
            //     // value: !!data.df_endDate,
            //     text: 'z terminem zakończenia'
            //   },
            //   colSpan: 1,
            // },
            {
              name: 'intervalCheckbox',
              editorType: 'dxCheckBox',
              label: {
                visible: false
              },
              visible: !!data.df_contractors,
              dataField: 'df_enable_interval',
              editorOptions: {
                text: 'utwórz z interwałem',
                onValueChanged(e) {
                  let formEl = $('#form-create-event').dxForm('instance')
                  formEl.itemOption('leftGroup.intervalGroup', 'visible', e.value)
                  formEl.itemOption('leftGroup.taskGroup.dateEnd', 'visible', !e.value)
                  formEl.itemOption('leftGroup.intervalEndDateCheckbox', 'visible', e.value)
                  if (!e.value)
                  formEl.updateData({df_interval_endDate: false})
                }
              },
              colSpan: 1,
            },
            {
              name: 'intervalEndDateCheckbox',
              editorType: 'dxCheckBox',
              label: {
                visible: false
              },
              visible: false,
              dataField: 'df_interval_endDate',
              editorOptions: {
                text: 'z datą graniczną',
                onValueChanged(e) {
                  let formEl = $('#form-create-event').dxForm('instance')
                  formEl.itemOption('leftGroup.taskGroup.dateEnd', 'visible', e.value)
                }
              },
              colSpan: 1,
            },
          ]
        },
        {
        itemType: 'group',
        name: 'intervalGroup',
        cssClass: 'interval-group',
        visible: !!data.df_enable_interval,
        colSpan: 3,
        items: interval_items
      },
      {
        itemType: 'group',
        // caption: 'Kontrahent',
        name: 'topicGroup',
        colSpan: 3,
        items: [
            {
                itemType: 'group',
                name: 'descriptionGroup',
                // caption: 'Działanie',
                colSpan: 2,
                colCount: 4,
                items: [
                    {
                      label: {
                          text: 'Typ'
                      },
                      colSpan: 1,
                      dataField: 'df_contact_type',
                      editorType: 'dxSelectBox',
                      editorOptions: {
                          // value: 1,
                          displayExpr: 'Nazwa',
                          dataSource: taskTypesDataSource,
                          onOpened(e) {
                            taskTypesDataSource.reload()
                          },
                          onValueChanged(e) {
                            if (e.value > 0)
                            $.post('/crm/contact_types', {id: e.value}, function(d) {
                              var formEl = $('#form-create-event').dxForm('instance')
                              formEl.updateData({df_duration: d.Domyslny_czas/60})
                            })
                          },
                          fieldTemplate(data, container) {
                              const result = $(`<div class="custom-item"><span class="${data && data.Ikona ? data.Ikona : ''}"></span><div class='product-name'></div></div>`);
                              result
                                .find('.product-name')
                                .dxTextBox({
                                  value: data ? data.Nazwa : '',
                                  readOnly: true,
                                });
                              container.append(result);
                          },
                          itemTemplate(data) {
                            if (data.Ikona)
                              return `<span class="${data.Ikona}"/>&nbsp;<span>${data.Nazwa}</span>`;
                              return `<span>${data.Nazwa}</span>`;
                          },
                          valueExpr: 'Id',
                          cssClass: 'contactSelect',
                      },
                  },
                    {
                        label: {
                            text: 'Temat'
                        },
                        colSpan: 3,
                        dataField: 'df_topic',
                        cssClass: 'topicInput',
                        editorOptions: {
                            label: 'Temat',
                            labelMode: 'floating',
                        },
                        validationRules: [{
                            type: 'required',
                            message: 'Nazwa jest wymagana.',
                        }],
                    }, 
                ]
            },
            {
              label: {
                  text: 'Treść'
              },
              colSpan: 4,
              // rowSpan: 4,
              cssClass:"descTextArea",
              editorType: 'dxTextArea',
              dataField: 'df_description',
              visible: data.df_contact_type != -2,
              editorOptions: {
                  height: 90,
                  label: 'Temat',
                  labelMode: 'floating'  
              },
          },
          {
            name: 'forms',
            itemType: 'group',
            visible: data.df_contact_type == -3,
            items: [
              {
                label: {
                    text: 'Formularz'
                },
                  colSpan: 1,
                  name: 'form_id',
                  dataField: 'df_form',
                  editorType: 'dxSelectBox',
                  editorOptions: {
                      // value: 1,
                      displayExpr: 'Nazwa',
                      dataSource: taskFormsDataSource,
                      valueExpr: 'Id',
                      // cssClass: 'contactSelect',
                  },
              },
              {
                label: {
                    text: 'Identyfikator'
                },
                colSpan: 3,
                dataField: 'df_form_id',
                editorOptions: {
                    label: 'Identyfikator',
                    labelMode: 'floating',
                },
            }, 
            ]
          },
          {
            itemType: 'group',
            name: 'tasks-container',
            visible: data.df_contact_type == -2,
            items: [
              {
                itemType: 'group',
                name: 'task_list',
                items: getTasksOptions(data.df_tasks)
              },
              {
                itemType: 'button',
                horizontalAlignment: 'left',
                cssClass: 'add-task-button',
                buttonOptions: {
                  icon: 'add',
                  text: 'Dodaj zadanie',
                  onClick(e) {
                    new_task_dialog.task_list.push('');
                    $('#form-create-event').dxForm('instance').itemOption('leftGroup.topicGroup.tasks-container.task_list', 'items', getTasksOptions(new_task_dialog.task_list));
                  },
                },
              },
            ]
          },
            {
                itemType: 'group',
                // caption: 'Kontrahent',
                name: 'contractorGroup',
                colSpan: 2,
                items: [
                    {
                      itemType: 'group',
                      colCount: 12,
                      cssClass: 'group-with-button',
                      items: [
                        {
                          label: {
                              text: data.interval ? `Wybrano ${typeof lead != 'undefined' ? 'leadów' : 'kontrahentów'}: ${data.df_contractors.length}` : (typeof lead != 'undefined' ? 'Lead' : 'Kontrahent')
                          },
                          name: 'contractor_elem',
                          colSpan: 11,
                          disabled: !!data.df_block_client || (data.df_contractor && data.df_contractor.length),
                          validationRules: [
                            {type: 'custom',
                            message: 'Kontrahent jest wymagany',
                            reevaluate: true,
                            validationCallback: function(e) {
                              var formEl = $('#form-create-event').dxForm('instance'),
                              allDay = formEl.getEditor('df_allDay').option('value'),
                              private = formEl.getEditor('df_private').option('value')
                              if (data.interval) return true
                              if (!allDay && !private) return !!e.value
                              return true
                            }}
                          ],
                          dataField: 'df_contractor',
                          editorType: 'dxDropDownBox',
                          editorOptions: {
                              // items: positions,
                              // displayExpr: 'Nazwa',
                              dropDownOptions: {
                                width: 900,
                              },
                              visible: !data.df_private,
                              displayExpr(item) {
                                return item && `${item.Nazwa || item.Imie + ' ' + item.Nazwisko} <${item.Telefon}>`;
                              },
                              showClearButton: true,
                              valueExpr: 'ID',
                              searchEnabled: true,
                              dataSource: taskClientsDataSource,
                              contentTemplate(e) {
                                const value = e.component.option('value');
                                const $dataGrid = $('<div class="task_clients_table">').dxDataGrid({
                                  wordWrapEnabled: true,
                                  dataSource: e.component.getDataSource(),
                                  columns: [{
                                    dataField: 'Nazwa_w',
                                    caption: 'Nazwa',
                                    encodeHtml: false
                                  }, 'Adres', 
                                  {
                                    dataField: 'NIP',
                                    width: 120
                                  }, 
                                  {
                                    dataField: 'Telefon_w',
                                    caption: 'Telefon',
                                    encodeHtml: false,
                                    width: 140
                                  }
                                  ],
                                  hoverStateEnabled: true,
                                  paging: { enabled: true, pageSize: 10 },
                                  filterRow: { visible: true },
                                  scrolling: { mode: 'virtual' },
                                  selection: { mode: 'single' },
                                  selectedRowKeys: [value],
                                  height: '100%',
                                  onSelectionChanged(selectedItems) {
                                    const keys = selectedItems.selectedRowKeys;
                                    const hasSelection = keys.length;
                          
                                    e.component.option('value', hasSelection ? keys[0] : null);
                                  },
                                });
                          
                                dataGrid = $dataGrid.dxDataGrid('instance');
                          
                                e.component.on('valueChanged', (args) => {
                                  dataGrid.selectRows(args.value, false);
                                  e.component.close();
                                });
                          
                                return $dataGrid;
                              },
                          },
    
                      },
                      {
                        colSpan: 1,
                        itemType: 'button',
                        visible: !companies.length,
                        buttonOptions: {
                          icon: 'plus',
                          type: 'default',
                          disabled: !!data.df_block_client,
                          onClick() {
                            toolsContractors.add({
                              module: "CRM",
                              callback: function (id) {
                                let formEl = $('#form-create-event').dxForm('instance')
                                formEl.updateData({'df_contractor': id})
                              },
                            });
                          },
                          onContentReady(e) {
                            $(e.element).css({'margin-top': '7px', 'height': '34px'})
                          }
                        },
                      },
                      ]
                    },
                    {
                        label: {
                            text: 'Osoba kontaktowa'
                        },
                        colSpan: 2,
                        dataField: 'df_contact_person',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            // items: positions,
                            visible: !data.df_private && !data.interval,
                            dataSource: taskContactsDataSource,
                            displayExpr: 'Nazwa',
                            valueExpr: 'ID',
                            searchEnabled: true,
                            // value: '',
                        },
                    },
                ],
            },          
        ]
    },
        ]
      },
      {
        itemType: 'group',
        name: 'rightGroup',
        colSpan: 4,
        items: [
          {
            colSpan: 1,
            label: {
                text: 'Prywatne'
            },
            dataField: 'df_private',
            editorType: 'dxCheckBox',
            editorOptions: {
                // value: false,
                width: 'auto',
                disabled: !!data.df_id || !!data.interval || !!data.df_mainTask || !!data.df_action_only
  
            },
          },
          {
            itemType: 'group',
            // caption: 'Kontrahent',
            name: 'userGroup',
            colSpan: 2,
            items: [
                {
                  itemType: 'group',
                  colCount: 12,
                  cssClass: 'group-with-button',
                  name: 'performerGroup',
                  items: [
                    {
                      label: {
                          text: 'Wykonawca'
                      },
                      colSpan: 10,
                      name: 'performer',
                      dataField: 'df_performer',
                      editorType: 'dxSelectBox',
                      editorOptions: {
                          displayExpr: 'nazwa',
                          dataSource: taskUsersDataSource,
                          valueExpr: 'id',
                          searchEnabled: true,
                          onValueChanged() {
                            $('#form-create-event').dxForm('instance').validate()
                          }
                      },
                  },
                  {
                    colSpan: 2,
                    itemType: 'button',
                    visible: !companies.length,
                    buttonOptions: {
                      icon: 'far fa-calendar-alt',
                      hint: 'Wyświetl kalendarz użytkownika',
                      type: 'default',
                      onClick() {
                        var formEl = $('#form-create-event').dxForm('instance'),
                        data = formEl.option('formData'),
                        user = parseInt(data.df_performer)
                        if (isNaN(user) || user < 0) return
                        var date = moment(data.df_dateFrom)
                        if (!date || !date.isValid()) {
                          date = moment()
                        }
                        $('#user_tasks_dialog').data('user', user)
                        // $('#user_calendar').data('trigger', $(this))
                        $.post('/api/user_tasks', {id: user, module: 'crm', date: date.format('YYYY-MM-DD')}, function(d) {
                          $.post('/user_planned_contacts', {user: user, mes: date.format('M'), ano: date.format('YYYY')}, function(d1) {
                            var data = {}
                            for (var i = 0; i < d.data.length; i++) {
                              if (data[d.data[i].date])
                              data[d.data[i].date] += d.data[i].content
                              else
                              data[d.data[i].date] = d.data[i].content
                            }
                            for (var i = 0; i < d1.length; i++) {
                              if (data[d1[i].date])
                              data[d1[i].date] += d1[i].content
                              else
                              data[d1[i].date] = d1[i].content
                            }
                            var events = []
                            for (var val in data) {
                              events.push({
                                date: val,
                                content: data[val],
                                title: data[val]
                              })
                            }
                            if (typeof displayUserTasks != 'undefined')
                            displayUserTasks({data: events}, date._d, user)
                            initPlannedUserTable()
                          })
                        })
                      },
                      onContentReady(e) {
                        $(e.element).css({'margin-top': '8px', 'height': '34px'})
                      }
                    },
                  },
                  ]
                },
                {
                    itemType: 'group',
                    name: 'accessGroup',
                    // caption: 'Działanie',
                    colSpan: 2,
                    colCount: 2,
                    items: [
                        {
                            label: {
                                text: 'Dostęp użytkownicy'
                            },
                            colSpan: 2,
                            dataField: 'df_access_select',
                            editorType: 'dxTagBox',
                            validationRules: [
                              {type: 'custom',
                              message: 'Dostęp jest wymagany',
                              reevaluate: true,
                              validationCallback: function(e) {
                                var formEl = $('#form-create-event').dxForm('instance'),
                                data = formEl.option('formData')
                                if (data.df_private || (data.df_performer != -1 && data.df_performer != -3) || (data.df_departments_access && data.df_departments_access.length)) return true
                                return !!e.value.length
                              }}
                            ],
                            editorOptions: {
                                displayExpr: 'nazwa',
                                dataSource: taskUsersAccessDataSource,
                                showSelectionControls: true,
                                valueExpr: 'id',
                                label: 'Dostęp użytkownicy',
                                labelMode: 'floating',
                                onValueChanged: function(e) {
                                  $('#form-create-event').dxForm('instance').validate()
                                }
                            },
                        }, {
                            label: {
                                text: 'Dostęp departamenty'
                            },
                            colSpan: 2,
                            dataField: 'df_departments_access',
                            editorType: 'dxTagBox',
                            validationRules: [
                              {type: 'custom',
                              message: 'Dostęp jest wymagany',
                              reevaluate: true,
                              validationCallback: function(e) {
                                var formEl = $('#form-create-event').dxForm('instance'),
                                data = formEl.option('formData')
                                if (data.df_private || (data.df_performer != -1 && data.df_performer != -3) || (data.df_access_select && data.df_access_select.length)) return true
                                return !!e.value.length
                              }}
                            ],
                            editorOptions: {
                                displayExpr: 'Nazwa',
                                valueExpr: 'Id',
                                dataSource: taskDepsAccessDataSource,
                                label: 'Dostęp departamenty',
                                labelMode: 'floating',
                                onValueChanged: function(e) {
                                  $('#form-create-event').dxForm('instance').validate()
                                }
                            },
                        }]
                },
                {
                  label: {
                      text: 'Kategoria'
                  },
                  colSpan: 2,
                  name: 'df_category',
                  dataField: 'df_category',
                  editorType: 'dxTagBox',
                  visible: data.df_contact_type < 0,
                  editorOptions: {
                      dataSource: taskCategoryDataSource,
                      acceptCustomValue: true,
                      onCustomItemCreating: (args) => {
                        if (!args.text) {
                            args.customItem = null;
                            return;
                        }
             
                        const { component, text } = args;
                        const currentItems = component.option('items');
             
                        const newItem = {
                            nazwa: text.trim(),
                        };
             
                        const itemInDataSource = currentItems.find((item) => item.nazwa.toLowerCase() === newItem.nazwa.toLowerCase())
                        if (itemInDataSource) {
                            args.customItem = itemInDataSource;
                        } else {    
                            currentItems.push(newItem);
                            component.option('items', currentItems);
                            args.customItem = newItem;
                        }
                    },
                      // items: positions,
                      // searchEnabled: true,
                      displayExpr: 'nazwa',
                      valueExpr: 'nazwa',
                  },
              },
              {
                name: 'anchor',
                visible: data.df_contact_type < 0 && !companies.length && !data.df_block_cycle,
                template: function(d, itemElement) {
                  if (data.df_cdr) return
                  var elem = $('<div/>'),
                  span = $('<span>przypisz do istniejącego </span>')
                  span.append($('<span class="link-elem" data-type="order-1">zlecenia</span> / <span class="link-elem">zamówienia</span>'))
                  elem.append(span)
                  var cont = $('<div class="elem-container"></div>')
                  var select = $('<select class="col-xs-12 no-padding-col selectpicker" name="cdr"></select>')
                  select.data('live-search', true).data('size', 10).data('none-results-text', 'Nie znaleziono wyników dla {0}')
                  .data('container', 'body')
                  cont.append(select)
                  elem.append(cont)
                  .appendTo(itemElement)

                }
              }
            ]
          }
        ]
      }
    ]
  },
  init: function(opts) {
    new_task_dialog.task_list = []
    if (opts && opts.data) {
      opts.data.df_tasks = opts.data.df_tasks || []
      opts.data.df_endDate = opts.data.df_endDate || false
      opts.data.df_cycleStart = opts.data.df_cycleStart || opts.data.df_dateFrom
    }
    new_task_dialog.open(opts ? opts.data : {'df_performer': -2, 'df_contact_type': 1, 'df_duration': 30, 'df_tasks': [], 'df_endDate': false}, opts ? (opts.cb || null) : null)
  },
  open: function(data, cb) {
    if (!$('#add_task_dialog').length)
      $('body').append('<div id="add_task_dialog"></div>')
    const popup = $('#add_task_dialog').dxPopup({
      width: 1100,
      onHidden(e) {
        if (cb)
        cb()
      },
      toolbarItems: [{
        toolbar: 'bottom',
        location: 'after',
        cssClass: 'dx-popup-task-save',
        template: function() {
          return `<div class="btn btn-lg btn-warning">Zapisz</div>`
        }
        }, {
            toolbar: 'bottom',
            cssClass: 'dx-popup-task-close',
            location: 'after',
            template: function() {
              return `<div class="btn btn-lg btn-default">Zamknij</div>`
            }
        }],
      contentTemplate: () => {
        const content =
        $(`<div>
          <div class="popupContent">
          </div>
        </div>`)
        content.find('.popupContent').append('<div id="form-create-event"></div>')
        var flag = true
        const form = content.find('#form-create-event').dxForm({
          labelMode: 'floating',
          formData: data,
          readOnly: false,
          showColonAfterLabel: true,
          colCount: 11,
          showValidation: true,
          items: new_task_dialog.formItems(data),
          onContentReady: function(e) {
            quickParts.init($('.descTextArea textarea'), 'ZADANIA')
            quickParts.init($('.topicInput input'), 'ZADANIA TEMAT')
            if (data.company && flag) {
              flag = false
              $.post('/license/module/check', {modul: 'crm', userid: true, cid: data.company}, function(d) {
                if (d.success) {
                  e.component.updateData({only_events: false})
                } else {
                  e.component.updateData({only_events: true})
                }
              })
            }
            // if (data)
            // e.component.repaint()
          },
          onFieldDataChanged: function(e, a) {
            let formEl = $('#form-create-event').dxForm('instance')
            if (!formEl) return
            var formData = formEl.option('formData')
            var allDay = formEl.getEditor('df_allDay').option('value'),
            endDate = formEl.getEditor('df_endDate') ? formEl.getEditor('df_endDate').option('value') : true,
            private = formEl.getEditor('df_private').option('value'),
            contactType = formEl.getEditor('df_contact_type') ? formEl.getEditor('df_contact_type').option('value') : formData.df_contact_type || 0
            formEl.beginUpdate()
            if (e.dataField == 'df_allDay' && !allDay)
            formEl.updateData({'df_duration': 30})
            else if (e.dataField == 'df_allDay') 
            formEl.updateData({'df_duration': 1})
            if (contactType > 0 && allDay) {
              formEl.updateData({'df_contact_type': -1})
              contactType = -1
            }
            if (contactType < 0 && !allDay) {
              formEl.updateData({'df_contact_type': 1})
              contactType = 1
            }
            formEl.itemOption('leftGroup.topicGroup.tasks-container', 'visible', contactType == -2 && !private && !formData.only_events)
            formEl.itemOption('leftGroup.topicGroup.forms', 'visible', contactType == -3 && !formData.only_events)
            formEl.itemOption('leftGroup.topicGroup.df_description', 'visible', contactType != -2 || private)
            var timeFrom = $('#dateBoxTimeFrom').dxDateBox('instance'),
            timeTo = $('#dateBoxTimeTo').dxDateBox('instance'),
            dateTo = $('#dateBoxTo').dxDateBox('instance'),
            dateFrom = $('#dateBoxFrom').dxDateBox('instance')
            var duration = formData.df_duration
            
            if (e.dataField == 'df_duration') {
              var date_start = moment(formEl.option('formData').df_dateFrom)
              var date_end = moment(date_start).add(allDay ? duration - 1 : duration, allDay ? 'd' : 'm')
              // if (allDay || !endDate) {
                if (timeTo)
                timeTo.option('value', date_end.toDate())
                if (dateTo)
                dateTo.option('value', date_end.toDate())
              // }
            }
            if (e.dataField == 'df_dateFrom') {
              var date_start = moment(formEl.option('formData').df_dateFrom)
              var date_end = moment(formEl.option('formData').df_dateTo)
              if (date_end.isBefore(date_start)) {
                var ds = moment(date_start).add(allDay ? duration - 1 : duration, allDay ? 'd' : 'm')
                if (timeTo)
                timeTo.option('value', ds.toDate())
                if (dateTo)
                dateTo.option('value', ds.toDate())
                formEl.updateData({'df_dateTo': ds.toDate()})
              }
              // if (allDay || !endDate) {
              // }
            }            
            form.itemOption('rightGroup.userGroup.df_category', 'visible', !private && contactType < 0 && !formData.only_events)
            if (e.dataField == 'df_private' || e.dataField == 'only_events') {
              formEl.itemOption('rightGroup.userGroup.performerGroup.performer', 'visible', !private && !formData.only_events)
              formEl.itemOption('leftGroup.topicGroup.descriptionGroup.df_contact_type', 'visible', !private && !formData.only_events)
              formEl.itemOption('leftGroup.topicGroup.descriptionGroup.df_topic', 'colSpan', private || formData.only_events ? 4 : 3)
              formEl.itemOption('leftGroup.topicGroup.contractorGroup', 'visible', !private && !formData.only_events)
              formEl.itemOption('rightGroup.userGroup.df_category', 'visible', !private && !formData.only_events)
              formEl.itemOption('rightGroup.userGroup.accessGroup.df_departments_access', 'visible', !private && !formData.only_events)
              formEl.updateData({'df_performer': -2})
            }
            if (e.dataField == 'df_allDay') {
              timeFrom.option('visible', !allDay)
              if (timeTo)
              timeTo.option('visible', !allDay)
              formEl.itemOption('rightGroup.userGroup.anchor', 'visible', allDay && !private && !formData.only_events && !formData.company)
              // formEl.itemOption('leftGroup.endDateCheckbox', 'visible', !allDay)
            }
            if (e.dataField == 'df_contractor' && e.value) {
              formEl.updateData({'df_contact_person': null})
              taskContactsDataSource.reload()
            }
            // formEl.itemOption('leftGroup.taskGroup.dateEnd', 'visible', (formEl.getEditor('df_endDate') && formEl.getEditor('df_endDate').option('value')) || allDay)
            formEl.endUpdate()
            $('#form-create-event').dxForm('instance').validate()
            quickParts.init($('.descTextArea textarea'), 'ZADANIA')
            quickParts.init($('.topicInput input'), 'ZADANIA TEMAT')
          }
        }).dxForm('instance')
        content.dxScrollView({
          scrollByContent: true,
          scrollByThumb: true
        });
        return content
      }
    }).dxPopup('instance')
    popup.show()
    quickParts.init($('.descTextArea textarea'), 'ZADANIA')
    quickParts.init($('.topicInput input'), 'ZADANIA TEMAT')
  }
}
var cycleUpdate = function(data, type) {
  var url = '/task_cycle_update'
  if (type == 'task')
  url = '/crm/api/task_cycle_update'
  $.post(url, data, function() {
    if (typeof cycles != 'undefined')
    cycles.ajax.reload()
    $("#add_task_dialog").dxPopup("instance").hide()
  })
}
$(function(){  
  $('body').on('click', '.dx-popup-task-save', function() {
    const form = $('#form-create-event').dxForm('instance')
    const valid = form.validate()
    var dialog = $("#add_task_dialog").dxPopup("instance")
    if (!valid.isValid)
        return
        var data = form.option('formData')    
    if (data.df_allDay && !data.df_private && !data.only_events) {
        var task = {
            module: 'crm',
            date: moment(data.df_dateFrom).format('YYYY-MM-DD'),
            name: data.df_topic,
            content: data.df_description,
            ops: data.df_performer < 0 ? '' : data.df_performer,
            ops_shared: data.df_access_select,
            category: (data.df_category || []).join(','),
            duration: moment(data.df_dateTo).diff(moment(data.df_dateFrom), 'days')+1,
            id: data.df_id,
            deps: data.df_departments_access || [],
            client: data.df_contractor,
            contact: data.df_contact_person,
            mainId: data.df_mainTask
        }
        if (data.df_performer == -3)
        task.ops = 'group2'
        if (data.df_cycle) {
          task.cycle = 1
          task.cycle_type = data.df_cycleType
          task.cycle_start = moment(data.df_cycleStart).format('YYYY-MM-DD')
          task.cycle_end = moment(data.df_cycleEnd).format('YYYY-MM-DD')
          task.cycle_amount = data.df_cycleAmount
          task.cycle_in_advance = data.df_inAdvance
        }
        if (data.df_performer == -1)
        task.ops = 'group'
        if (data.df_contact_type == -3) {
          task.form = data.df_form
          task.form_id = data.df_form_id
        }
        var select = $('.dx-popup-content select[name=cdr]')
        if (select.val()) {
          task.cdr = select.val()
          task.module = select.data('module')
        }
        if (data.df_cdr) {
          task.cdr = data.df_cdr
          task.module = 'crm'
        }
        if (data.df_contact_type == -2) {
          task.tasks = []
          data.df_tasks.forEach(x => {
            task.tasks.push({
              content: x
            })
          })
        }
        if (data.df_edit_dates) {
          task.start_date = moment(data.df_startDate).format()
          task.end_date = moment(data.df_taskEndDate).format()
          task.time_diff = (data.df_timeHours * 60 * 60) + (data.df_timeMinutes * 60) - data.df_time
          if (Math.abs(task.time_diff) < 60)
            task.time_diff = 0
        }
        if (data.df_cycle_id) {
          task.id = data.df_cycle_id
          return cycleUpdate(task, 'task')
        }
        var url = '/crm/api/new_task'
        if (data.df_id)
        url = '/crm/api/edit_task_'
        $.post(url, task, function() {
          if (data.df_id) {
            socketUpdate({task: data.df_id, type: 'task'})
          }
          if (data.df_id && typeof editTaskCallback != 'undefined')
            editTaskCallback(task.id)
          else
            newTaskCallback()
            dialog.hide()
        })
    }
    else if (data.df_private || data.only_events) {
      var task = {
        Nazwa: data.df_topic,
        Opis: data.df_description,
        Operator: data.df_performer,
        DataOd: moment(data.df_dateFrom).format('YYYY-MM-DD HH:mm'),
        DataDo: moment(data.df_dateTo).format('YYYY-MM-DD HH:mm'),
        Calodniowe: data.df_allDay ? true : false,
        Prywatne: data.df_private ? true : false,
        Dostep: data.df_access_select,
        Departamenty: data.df_departments_access || [],
        Firma: data.companySelect || '',
        Cykliczne: data.df_cycle ? 1 : 0,
        CyklOd: data.df_cycle ? moment(data.df_cycleStart).format('YYYY-MM-DD') : null,
        CyklDo: data.df_cycle ? moment(data.df_cycleEnd).format('YYYY-MM-DD') : null,
        CyklTyp: data.df_cycleType,
        Interwal: data.df_cycleAmount,
        Wyprzedzenie: data.df_inAdvance
      }
      // var task = {
      //   name: data.df_topic,
      //   date: moment(data.df_dateFrom).format(),
      //   date_end: moment(data.df_dateTo).format(),
      //   user: data.df_performer < 0 ? '' : data.df_performer,
      //   desc: data.df_description,
      //   id: data.df_id
      // }
      // if (data.df_private)
      // task.private = 1
      $.post(`/firmotron/calendar/event/create`, task, function() {
        if (typeof newTaskCallback != 'undefined')
        newTaskCallback()
        if (typeof planned_table != 'undefined')
        planned_table.ajax.reload()
        dialog.hide()
      })
    }
    else if (!data.df_allDay) {
      var task = {
        name: data.df_topic,
        date: moment(data.df_dateFrom).format(),
        date_end: moment(data.df_dateTo).format(),
        type_id: data.df_contact_type,
        client: data.df_contractor,
        contact: data.df_contact_person,
        user: data.df_performer < 0 ? '' : data.df_performer,
        op: data.df_performer == -1 ? 'group' : (data.df_performer > 0 ? data.df_performer : ''),
        desc: data.df_description,
        deps: data.df_departments_access || [],
        id: data.df_id,
        pracownicy: data.df_access_select,
        clients: data.df_contractors,
        end_date: data.df_endDate ? 1 : 0,
        chance: data.df_chance
      }
      if (data.df_performer == -3) {
        task.op = 'group'
        task.group_type = 'group'
      } else {
        task.group_type = ''
      }
      if (data.df_cdr) {
        task.id_zamowienia = data.df_cdr
      }
      if (data.df_series && data.df_hash) {
        task.hash = data.df_hash
        task.multiple = true
      }
      if (data.df_cycle) {
        task.cycle = 1
        task.cycle_type = data.df_cycleType
        task.cycle_start = moment(data.df_cycleStart).format('YYYY-MM-DD')
        task.cycle_end = moment(data.df_cycleEnd).format('YYYY-MM-DD')
        task.cycle_amount = data.df_cycleAmount
        task.cycle_in_advance = data.df_inAdvance
      }
      if (data.df_enable_interval) {
        task.interval = data.df_interval
        task.interval_from = moment(data.df_interval_from).format('HH:mm')
        task.interval_to = moment(data.df_interval_to).format('HH:mm')
        task.interval_end_date = data.df_interval_endDate
        task.duration = data.df_duration        
        task.interval_days = []
        for (var i = 0; i < 7; i++) {
          if (data[`df_interval_${i}`])
          task.interval_days.push(i)
        }
      }
      if (data.df_cycle_id) {
        task.id = data.df_cycle_id
        return cycleUpdate(task, 'contact')
      }
      var url = '/crm/crm_setDate'
      if (data.df_id)
      url = '/crm/crm_updateDate'
      $.post(url, task, function(d) {
        if (task.clients) {
          $('#new_actions_info_dialog').html('<p>Zaplanowano ' + d + ' działań.</p>')
          $('#new_actions_info_dialog').dialog('open')
        }
        if (typeof newTaskCallback != 'undefined')
        newTaskCallback()
        if (typeof planned_table != 'undefined')
        planned_table.ajax.reload()
        dialog.hide()
        if (data.df_id) {
          socketUpdate({task: data.df_id, type: 'action'})
        }
      })
    }
  })
  $('body').on('click', '.dx-popup-task-close', function() {
    $("#add_task_dialog").dxPopup("instance").hide()
  })
})