<div class="modal fade see" id="see" tabindex="-1" role="dialog" aria-labelledby="image-gallery-modal" aria-hidden="true" data-backdrop="static">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <form name="see">
                <div class="modal-header">
                    <h3 class="mb-0">Ver Ubicación</h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body p-4 row">
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Nombre Empresa *</label>
                            <input type="text" class="form-control" id="nombre" ng-model="edit.nombre_empresa" disabled> 
                        </div>
                    </div> 
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Tipo *</label>
                            <input type="text" class="form-control" id="tipo" ng-model="edit.tipo" disabled> 
                        </div>
                    </div> 
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Dirección *</label>
                            <input type="text" class="form-control" id="direccion" ng-model="edit.direccion" disabled> 
                        </div>
                    </div> 
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Telefono 1 *</label>
                            <input type="text" class="form-control" id="telefono_1" ng-model="edit.telefono_1" disabled> 
                        </div> 
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Telefono 2</label>
                            <input type="text" class="form-control" id="telefono_2" ng-model="edit.telefono_2" disabled> 
                        </div> 
                    </div>
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label for="nombre">Correo Electrónico *</label>
                            <input type="text" class="form-control" id="correo" ng-model="edit.correo" disabled> 
                        </div> 
                    </div>
                    <div class="col-lg-3">
                        <div class="form-group">
                            <label for="nombre">Latitud *</label>
                            <input type="text" class="form-control" id="lat" ng-model="edit.lat" disabled> 
                        </div> 
                    </div>
                    <div class="col-lg-3">
                        <div class="form-group">
                            <label for="nombre">Longitude *</label>
                            <input type="text" class="form-control" id="lng" ng-model="edit.lng" disabled> 
                        </div> 
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="nombre">Foto *</label>
                            <input type="text" class="form-control" id="foto" ng-model="edit.foto" disabled> 
                        </div> 
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="nombre">Extracto</label>
                            <textarea class="form-control" id="extracto" rows="3" ng-model="edit.extract" disabled></textarea>
                        </div>
                    </div>
                    <div class="col-lg-6"> 
                        <div class="form-group">
                            <label for="descripcion">Descripción</label>
                            <textarea class="form-control" id="descripcion" rows="3" ng-model="edit.descripcion" disabled></textarea>
                        </div>  
                    </div>  
                </div> 
            </form>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>