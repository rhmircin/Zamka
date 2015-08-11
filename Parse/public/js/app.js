var timenow=Date.now();
moment.locale('es');
angular.module('ZamkaAdmin', ['ngMaterial','ngRoute','mdDateTime'])
.config(function($mdThemingProvider,$routeProvider,$interpolateProvider,$locationProvider) {
  $routeProvider
      .when('/App', {
      templateUrl: '/partials/app/index.html',
      controller: 'indexCtrl'
      })
      .when('/App/Login', {
        templateUrl: '/partials/app/login.html',
        controller: 'loginCtrl'
      })
      .when('/App/SignUp', {
          templateUrl: '/partials/app/signup.html',
          controller: 'signupCtrl'
      })
      .when('/App/Eventos', {
        templateUrl: '/partials/app/eventos.html',
        controller: 'eventosCtrl'
      })
      .when('/App/Categoria/:cat', {
          templateUrl: '/partials/app/eventos.html',
          controller: 'categoriaCtrl'
      })
      .when('/App/Evento/:id', {
        templateUrl: '/partials/app/evento.html',
        controller: 'eventoCtrl'
      })
      .when('/App/Perfil/:id', {
        templateUrl: '/partials/app/perfil.html',
        controller: 'perfilCtrl'
      })
      .when('/App/ONG/:id', {
        templateUrl: '/partials/app/ong.html',
        controller: 'ongCtrl'
      })
      .when('/App/MiCuenta', {
          templateUrl: '/partials/app/mispeticiones.html',
          controller: 'perfilCtrl'
      });
  $mdThemingProvider.theme('default');
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
})
.controller('AppCtrl', function($scope,$timeout,$location,$http,$log,$mdToast){
    $scope.cargando = false;
    //CheckLogin
    if(localStorage.usuario){
        $scope.usuario = JSON.parse(localStorage.usuario);
    }

    $scope.irEvento = function(id){
        $location.url("/App/Evento/"+id);
    };
    ///FB LOGIN
    $scope.loginFB = function(){
        $scope.cargando = true;
        $http.post("/API/Login",{
            correo:"test@zamka.org",
            password:null,
            fbid:511882046
        }).success(function(data){
            $scope.cargando = false;
            $log.log("--SUCCESS--");
            $log.log("data:",data);
        });
    };
    // LOGIN
    $scope.login = function(correo,password,fbid){
        $scope.cargando = true;
        $http.post("/API/Login",{
            correo:correo,
            password:password,
            fbid:fbid
        }).success(function(data){
            $scope.cargando = false;
            $log.log("--SUCCESS--");
            $log.log("data:",data);
            $scope.usuario = {
                email:data.email,
                fbid:data.facebookID,
                foto:data.image.url,
                nombre:data.name
            };
            localStorage.usuario = JSON.stringify($scope.usuario);

            if (data.objectId){
                $location.url("/App/Eventos");
            }
        }).error(function(data){
            $scope.cargando = false;
            $log.log("--Error--");
            $log.log("data:",data);
        });
    };
    //LOGOUT
    $scope.logout = function(){
        localStorage.usuario = null;
        $scope.usuario = null;
        $location.url("/App");
    }
    //CATEGORIAS
    $scope.getCategorias = function(){
        $scope.cargando = true;
        $http.get("/API/Categorias").success(function(data){
            $scope.categorias = [];
            for (key in data){
                $scope.categorias.push(data[key].Nombre);
            }
            $scope.cargando = false;
            $log.log("Categorias:",$scope.categorias);
        });
    }
    ///EVENTOS
    $scope.getEventos = function(){
        $scope.cargando = true;
        $scope.eventos = [];
        $http.get("/API/Buscar?busqueda=").success(function(data){
            for (key in data){
                var evento = data[key];
                $scope.eventos.push({
                    categoria:evento.Categorias[0],
                    descripcion:evento.Descripcion,
                    fecha:evento.Fecha.iso,
                    nombre:evento.Nombre,
                    foto:evento.Imagen.url,
                    id:evento.objectId
                });
            }
            $scope.cargando = false;
            $log.log("Eventos:",$scope.eventos);
        });
    };
    ///EVENTOS CATEGORTIA
    $scope.getEventosCat = function(cat){
        $scope.cargando = true;
        $scope.eventos = [];
        $http.get("/API/EventosCat?categoria="+cat).success(function(data){
            for (key in data){
                var evento = data[key];
                $scope.eventos.push({
                    categoria:evento.Categorias[0],
                    descripcion:evento.Descripcion,
                    fecha:evento.Fecha.iso,
                    nombre:evento.Nombre,
                    foto:evento.Imagen.url,
                    id:evento.objectId
                });
            }
            $scope.cargando = false;
            $log.log("Eventos:",$scope.eventos);
        });
    };
    //EVENTO
    $scope.getEvento = function(id){
        $scope.cargando = true;
        $scope.evento={};
        $http.get("/API/Evento?idEvento="+id).success(function(data){

            $log.log("data:",data);
            $scope.evento={
                categoria:data.Categorias[0],
                contenido:data.Contenido,
                descripcion:data.Descripcion,
                fecha:data.Fecha,
                nombre:data.Nombre,
                foto:data.Imagen["_url"],
                comentarios:[],
                fotos: [],
                org:{
                    nombre:data.Organizacion.Nombre,
                    id:data.Organizacion.objectId,
                    foto:data.Organizacion.Foto.url
                }
            };
            for (key in data.Comentarios){
                $scope.evento.comentarios.push({
                    usuario:{
                        nombre:data.Comentarios[key].Nombre,
                        foto:data.Comentarios[key].Foto["_url"],
                        id:data.Comentarios[key].idUsuario,
                        fecha:data.Comentarios[key].Fecha
                    },
                    comentario:data.Comentarios[key].Comentario
                })
            }
            for(key in data.Fotos){
                $scope.evento.fotos.push(data.Fotos[key].Archivo.url);
            }
            $scope.cargando = false;
            $log.log("Evento:",$scope.evento);
        });
    };
    //SOLICITAR PARTICIPACION
    $scope.solicitarParticipacion = function(idEvento,idUsuario){
        $scope.cargando = true;
        $http.post("/API/Participar",{
            idEvento:idEvento,
            idUsuario:idUsuario
        }).success(function(){
            $scope.cargando = false;
            swal(
                {
                    title:"Exito!",
                    text:"Registramos tu peticion para participar, por favor este atento a su confirmacion.",
                    type:"success",
                    confirmButtonColor: "#009688"
                });
        });

    }
    //PERFIL
    $scope.getUsuario = function(id){
        $scope.perfil={};
        $scope.cargando = true;
        $http.get("/API/Usuario?idUsuario="+id)
            .success(function(data){
            $scope.cargando = false;
            $log.log("PerfilData:",data);
            $scope.perfil={
                nombre:data.Nombre,
                foto:data.Foto["_url"],
                gustos:data.Gustos,
                participaciones:data.listaParticipacion
            };
        });
    }
    //UTIL
    $scope.showDate = function(iso){
        return moment(iso).format("Do MMM YYYY");
    }
    $scope.timeSince = function(iso){
        return moment(iso).fromNow();
    }
    $scope.verFecha = function(){
        $log.log("fecha:",$scope.fechafecha);
    }
    $scope.toastPosition = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.getToastPosition = function() {
        return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
    };

    $scope.showToast = function(txt) {
        $mdToast.show(
            $mdToast.simple()
                .content(txt)
                .position($scope.getToastPosition())
                .hideDelay(3000)
        );
    };
    $scope.searchCategoria = function(cat){
        $location.url("/App/Categoria/"+cat);
    };
    $scope.listaUno=function(arr){
        return arr[0];
    }




})
.controller('indexCtrl',function($scope,$timeout,$location){
    $timeout(function(){
        if($scope.usuario){
            $location.url("/App/Eventos");
        }else{
            $location.url("/App/Login");
        }
    },300,true);

})
.controller('loginCtrl',function($scope,$timeout,$location){

})
.controller('signupCtrl',function($scope,$timeout,$location){

})
.controller('eventosCtrl',function($scope,$timeout,$location){
    $scope.getCategorias();
    $scope.getEventos();
})
.controller('categoriaCtrl',function($scope,$timeout,$location,$routeParams){
    $scope.getCategorias();
    $scope.getEventosCat($routeParams.cat);
})
.controller('eventoCtrl',function($scope,$timeout,$location,$routeParams){
        $scope.getEvento($routeParams.id);
        $scope.confirmarParticipacion = function(){
            swal({
                    title: "Estas Seguro?",
                    text: "Si aceptas participar en este evento es un compromiso con esta organizacion y deberas cumplir en asistir al evento",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#009688",
                    confirmButtonText: "Si,Deseo Participar!",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false },
                function(){
                    $scope.solicitarParticipacion($routeParams.id,$scope.usuario.id);
                });
        };
})
.controller('perfilCtrl',function($scope,$timeout,$location,$routeParams){
        $scope.getUsuario($routeParams.id);
})
.controller('ongCtrl',function($scope,$timeout,$location){

});