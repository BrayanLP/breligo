<div class="modal fade edit" id="edit" tabindex="-1" role="dialog" aria-labelledby="image-gallery-modal" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-sd" role="document">
        <div class="modal-content">
            <form name="edit" id="edit">
                <div class="modal-header">
                    <h3 class="mb-0">Editar Entidades</h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body p-4"> 
                    <div class="form-group">
                        <label for="nombre">Nombre Entidades</label>
                        <input type="text" class="form-control" id="nombre" ng-model="edit.nombre"> 
                    </div>      
                </div> 
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary pull-right" ng-disabled="edit.$invalid" ng-click="update(edit.id)">Actualizar</button>
                </div>
            </form>
        </div> 
    </div> 
</div>