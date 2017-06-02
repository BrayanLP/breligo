<div class="modal fade create" id="create" tabindex="-1" role="dialog" aria-labelledby="image-gallery-modal" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form name="add">
                <div class="modal-header">
                    <h3 class="mb-0">Agregar Ubicación</h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body p-4 row">
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Nombre Empresa *</label>
                            <input type="text" class="form-control" id="nombre" ng-model="create.nombre" required> 
                        </div>
                    </div> 
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Tipo *</label>
                            <input type="text" class="form-control" id="tipo" ng-model="create.tipo" required> 
                        </div>
                    </div> 
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Dirección *</label>
                            <input type="text" class="form-control" id="direccion" ng-model="create.direccion" required> 
                        </div>
                    </div> 
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Telefono 1 *</label>
                            <input type="text" class="form-control" id="telefono_1" ng-model="create.telefono_1" required> 
                        </div> 
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Telefono 2</label>
                            <input type="text" class="form-control" id="telefono_2" ng-model="create.telefono_2" required> 
                        </div> 
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Correo Electrónico *</label>
                            <input type="text" class="form-control" id="correo" ng-model="create.correo" required> 
                        </div> 
                    </div>
                    <div class="col-lg-3">
                        <div class="form-group">
                            <label for="nombre">Latitud *</label>
                            <input type="text" class="form-control" id="lat" ng-model="create.lat" required> 
                        </div> 
                    </div>
                    <div class="col-lg-3">
                        <div class="form-group">
                            <label for="nombre">Longitude *</label>
                            <input type="text" class="form-control" id="lng" ng-model="create.lng" required> 
                        </div> 
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="nombre">Foto *</label>
                            <input type="text" class="form-control" id="foto" ng-model="create.foto" required> 
                        </div> 
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="nombre">Extracto</label>
                            <textarea class="form-control" id="extracto" rows="3" ng-model="create.extracto" required></textarea>
                        </div>
                    </div>
                    <div class="col-lg-6"> 
                        <div class="form-group">
                            <label for="descripcion">Descripción</label>
                            <textarea class="form-control" id="descripcion" rows="3" ng-model="create.descripcion" required></textarea>
                        </div>  
                    </div>  
                </div>
                <!-- /.modal-body -->
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary pull-right" ng-disabled="add.$invalid" ng-click="create()">Guardar</button> 
                </div>
            </form>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>