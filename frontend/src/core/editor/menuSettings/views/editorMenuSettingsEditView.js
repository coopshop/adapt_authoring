// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  var Backbone = require('backbone');
  var Origin = require('core/app/origin');
  var EditorOriginView = require('../../global/views/editorOriginView');
  var MenuSettingsCollection = require('../collections/editorMenuSettingsCollection');
  var MenuSettingsView = require('./editorMenuSettingsView');

  var EditorMenuSettingsEditView = EditorOriginView.extend({
    className: "editor-menu-settings-edit",
    tagName: "ul",

    preRender: function() {
      this.collection = new MenuSettingsCollection();
      this.listenTo(this.collection, 'sync', this.addMenuItemView);
      this.collection.fetch();

      this.listenTo(Origin, 'editorSideBarView:removeEditView', this.remove);
      this.listenTo(Origin, 'editorMenuSettingsEditSidebar:views:save', this.saveData);
    },

    addMenuItemView: function() {
      this.renderMenuItemViews();
    },

    renderMenuItemViews: function() {
      this.collection.each(function(menu) {
        var isSelected = menu.get('name') === this.model.get('_menu');
        menu.set('_isSelected', isSelected);
        if(isSelected || menu.get('_isAvailableInEditor') === true) {
          this.$('.menu-settings-list').append(new MenuSettingsView({ model: menu }).$el);
        }
      }, this);
      this.setViewToReady();
    },

    cancel: function(event) {
      event && event.preventDefault();
      Origin.trigger('editorSidebarView:removeEditView', this.model);
    },

    saveData: function(event) {
      event && event.preventDefault();

      if(this.collection.findWhere({ _isSelected: true }) === undefined) {
        return this.onSaveError(null, window.polyglot.t('app.errornomenuselected'));
      }
      $.post('/api/menu/' + selectedMenu.get('_id') + '/makeitso/' + this.model.get('_courseId'))
        .error(this.onSaveError)
        .done(this.onSaveSuccess);
    }
  }, {
    template: "editorMenuSettingsEdit"
  });

  return EditorMenuSettingsEditView;
});
