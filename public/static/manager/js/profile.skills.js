if(typeof Profile == "undefined"){
    var Profile = {};
}

Profile.skills = {
    urls: {},
    id: 0,
    template: "",
    actionTemplate:"",
    init_list: ["urls"],

    init: function(args) {
        Crazy.setup(this, args);
        this.onStart();
    },
    onStart:function(){
        var self = this;
        self.enableSort();
        $('.btn-add-profile-skill').click(function(){
            self.showNewForm();
        });
        let tpl = $('.nesttable-template');
        self.template = tpl.html();
        tpl.remove();
        let atpl = $('.item-action-template');
        self.actionTemplate = atpl.html();
        atpl.remove();
        // form thêm kỹ năng
        $('#add-skill-form').submit(function(e){
            e.preventDefault();
            let data = $(this).serialize();
            Crazy.modal.hide();
            showLoading();
            Crazy.ajax($(this).attr('action'), "POST", data, function(rs){
                hideLoading();
                if(rs.status){
                    Crazy.htmlSelect.addOption('skill_id', rs.data.id, rs.data.name);
                    self.showAddForm();
                }
                else{
                    let message = '';
                    if(rs.errors){
                        let messages = [];
                        for (const key in rs.errors) {
                            if (rs.errors.hasOwnProperty(key)) {
                                const error = rs.errors[key];
                                messages.push(error);
                            }
                        }
                        message = messages.join("<br>");
                    }else{
                        message = rs.message;
                    }
                    Crazy.modal.error(message, null, function(){
                        self.showSkillForm();
                    });
                }
            }, function(error){
                hideLoading();
            });
            return false;
        });

        $('#profile-skill-form').submit(function(e){
            e.preventDefault();
            let data = $(this).serializeArray();
            Crazy.modal.hide();
            showLoading();
            Crazy.ajax($(this).attr('action'), "POST", data, function(rs){
                hideLoading();
                if(rs.status){
                    let data = rs.data;
                    data.show_label = data.show?"Có":"";
                    if(self.id){
                        // 
                        let item = $('#profile-skill-list li.dd-item[data-id="'+data.id+'"]');
                        if(item.length){
                            item.find('.skill-name').html(data.name);
                            item.find('.skill-percentage').html(data.percentage);
                            item.find('.skill-show').html(data.show_label);
                            
                        }else{
                            $('#profile-skill-list').nestable('replace', {id:rs.data.id,content:Crazy.str.eval(self.template, data)});
                        }
                    }else{
                        $('#profile-skill-list').nestable('add', {id:rs.data.id,content:Crazy.str.eval(self.template, data)});
                        let item = $('#profile-skill-list li.dd-item[data-id="'+data.id+'"]');
                        if(item.length){
                            item.prepend(Crazy.str.eval(self.actionTemplate, {id:data.id}));
                            
                        }
                    }
                    self.id = 0;
                }
                else{
                    let message = '';
                    if(rs.errors){
                        let messages = [];
                        for (const key in rs.errors) {
                            if (rs.errors.hasOwnProperty(key)) {
                                const error = rs.errors[key];
                                messages.push(error);
                            }
                        }
                        message = messages.join("<br>");
                    }else{
                        message = rs.message;
                    }
                    Crazy.modal.error(message, null, function(){
                        self.showAddForm();
                    });
                }
            }, function(error){
                hideLoading();
            });
            return false;
        });

        $(document).on('click', '.item-actions .btn-edit-item',function(){
            self.showUpdateForm($(this).data('id'));
        });
        $(document).on('click', '.item-actions .btn-delete-item', function(){
            self.deleteSkill($(this).data('id'));
        });
    },
    sortCallback:function(l, e){
        var self = this;
        let raw = $(l).nestable('toArray');
        let data = {};
        raw.map(function (item, i) {
            data[item.id] = i+1;
        });

        Crazy.ajax(self.urls.sort_url, "POST", {data:data}, function(rs){
            if(rs.status){
                console.log(rs.message);
            }
            else{
                Crazy.modal.error(rs.message);
            }
        }, function(err){
            Crazy.modal.error("Lỗi không xác định");
        })
        
    },
    deleteSkill:function(id){
        var self = this;
        Crazy.modal.confirm("bạn có chắc chắn muốn xóa kỹ năng này?", function(status){
            if(status){
                showLoading();
                Crazy.ajax(self.urls.delete_url, "DELETE", {ids:[id]}, function(rs){
                    hideLoading();
                    if(rs.status){
                        $('#profile-skill-list').nestable('remove', id);
                    }else{
                        Crazy.modal.error(rs.message);
                    }
                }, function(err){
                    //
                    hideLoading();
                    Crazy.modal.error("Lỗi không xác định!");
                });
            }
        });
    },
    addWork: function(name){
        var self = this;
        Profile.works.showAddForm(name, function(work){
            self.showSkillForm();
        });
    },
    showUpdateForm:function(id){
        var self = this;
        showLoading();
        Crazy.ajax(self.urls.detail_url, "GET", {id:id}, function(rs){
            hideLoading();
            if(rs.status){
                self.id = id;
                self.showForm(rs.data);
            }else{
                Crazy.modal.error(rs.message);
            }
        }, function(err){
            //
            hideLoading();
            Crazy.modal.error("Lỗi không xác định!");
        });
    },
    showSkillForm: function(name){
        if(name) $('#skill-modal input#skill-name').val(name);
        Crazy.modal.show('skill-modal');
    },
    showForm: function(id, skill_id, percentage, show){
        if(typeof id != "undefined" && Crazy.getType(id) == 'object'){
            let obj = id;
            if(typeof obj.percentage != "undefined"){
                percentage = obj.percentage;
            }
            if(typeof obj.skill_id != "undefined"){
                skill_id = obj.skill_id;
            }
            if(typeof obj.show != "undefined"){
                show = obj.show;
            }
            id = obj.id;
        }else{
            if(typeof id == "undefined") id = '';            
        }

        if(typeof percentage == "undefined") percentage = '';
        if(skill_id){
            Crazy.htmlSelect.active('skill_id', skill_id);
        }else{
            Crazy.htmlSelect.deactive('skill_id', skill_id);
        }

        $('input#skill-show').prop('checked', show?true:false);
        
        $('input#skill-percentage').val(percentage);
        $('input#profile-skill-id').val(id);
        Crazy.modal.show('profile-skill-modal');
    },
    showAddForm: function(){
        Crazy.modal.show('profile-skill-modal');
    },
    showNewForm: function(){
        self.id = 0;
        this.showForm();
    },
    enableSort:function(){
        Crazy.nestable.add('#profile-skill-list');
    },
    disableSort:function(){
        Crazy.nestable.remove('#profile-skill-list');
    }
};

$(function(){
    if(typeof profile_skills == 'object'){
        Profile.skills.init(profile_skills);
    }
    else if(typeof profile_data == 'object'){
        let urls = {};
        let list = ["add", "create", "update", "detail", "delete", "sort"];
        for (let i = 0; i < list.length; i++) {
            const act = list[i];
            if(typeof profile_data[act+"_skill_url"] == "string"){
                urls[act+"_url"] = profile_data[act+"_skill_url"];
            }
        }
        
        Profile.skills.init({
            urls:urls
        });
    }

});