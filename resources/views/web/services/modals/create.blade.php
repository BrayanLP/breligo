<div class="modal fade create" id="create" tabindex="-1" role="dialog" aria-labelledby="image-gallery-modal" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-sd" role="document">
        <div class="modal-content">
            <form name="add" id="add">
                <div class="modal-header">
                    <h3 class="mb-0">Agregar Entidades</h3>
                    <a class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></a>
                </div>
                <div class="modal-body p-4">
                    <div class="form-group">
                        <label class="col-md-4 control-label">Cargar Icono</label>
                        <input type="file" class="form-control" name="icon" required>
                    </div>   
                    <div class="form-group">
                        <label for="nombre">Nombre Entidades</label>
                        <input type="text" class="form-control" id="nombre" name="nombre" ng-model="nombre" required> 
                    </div>     
                </div> 
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary pull-right" disabled ng-disabled="add.$invalid" ng-click="guardar()">Guardar</button> 
                </div>
            </form>
        </div> 
    </div> 
</div>