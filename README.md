# advancedForwarding plugin (Angular demo app)

This is an example of how you can create an IIQ Plugin based on an Angular application.

The great advantage is here that if you're familiar with Angular, but not necessarily with IIQ plugin development, you have an immediate headstart in getting a potentially advanced plugin ready with a minimal learning curve.

The code as presented here, is a relatively ready plugin that has a modest functionality, namely allowing you to set multiple kinds of forwarders for notifications that would be sent out for different types of WorkItems.

The point however is to show how you can create your own plugin based on an Angular app, using the steps outlined below.

## How to create your own plugin based on an angular app

### Plugin setup

#### Layout

First step is to create the file layout for the plugin. This can be done using the [Development Accelerator](https://developer.sailpoint.com/discuss/t/identityiq-deployment-accelerator-iiqda/18131) or just by making sure the necessary files for [the plugin structure](https://documentation.sailpoint.com/identityiq/help/plugins/developing_plugins.html) exist.

You can of course choose to use the current structure as a base and go from there. ;-)

#### Manifest

-   Edit the manifest file to define this as a full page plugin.

```xml
<?xml version='1.0' encoding='UTF-8'?>
<!DOCTYPE Plugin PUBLIC "sailpoint.dtd" "sailpoint.dtd">
<Plugin certificationLevel="None"
    name="angularTest"
    displayName="Angular Plugin"
    minSystemVersion="8.4"
    maxSystemVersion="8.4"
    version="0.1">
    <Attributes>
        <Map>
            <entry key="minUpgradableVersion" value="0.1" />
            <entry key="fullPage">
                <value>
                    <FullPage title="Advanced Forwarding Preferences" />
                </value>
            </entry>
            <entry key="snippets">
                <value>
                    <List>
                        <Snippet regexPattern=".*">
                            <Scripts>
                                <String>ui/js/headerInject.js</String>
                            </Scripts>
                        </Snippet>
                    </List>
                </value>
            </entry>
        </Map>
    </Attributes>
</Plugin>
```

#### Header Inject javascript

-   Create src/main/webapp/ui/js/headerInject.js

```javascript
jQuery(document).ready(function() {

 let pluginUrl = SailPoint.CONTEXT_PATH + '/plugins/pluginPage.jsf?pn=advancedForwarding';
 let check     = jQuery("a[href$='']");

 if (check.length > 0) { }

});
```

-   Find the correct URL from the IIQ page.
-   Insert the following in the if block:

```javascript
     check.parent().after(`<li role="presentation">
    <a href="${pluginUrl}" role="menuitem">
      <i role="presentation" aria-hidden="true" class="fa fa-wrench m-r-xms"></i>
      Advanced Forwarding
    </a>
</li>`)
```

-   Of course, adjust for your own usage and preference.
-   Copy the SailPointBundle:

```sh
cp [IIQ_INSTALLFOLDER]/identityiq/ui/js/bundles/SailPointBundle.js' src/main/webapp/ui/js
```

### Angular app setup

> [!NOTE]  
> Make sure to use Angular 15

#### Create the app

```sh
npx -p @angular/cli@15 ng new pluginapp
```

#### App Settings

-   In `package.json` change the `script.build` entry to `ng build --output-hashing=none`
-   In the `app.component.html` template, remove the first div tag.

#### Add the App to the plugin project

-   Create the `page.xhtml` page.

```html
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- (c) Copyright 2016 SailPoint Technologies, Inc., All Rights Reserved. -->
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:c="http://java.sun.com/jstl/core"
  xmlns:f="http://java.sun.com/jsf/core" xmlns:h="http://java.sun.com/jsf/html" xmlns:sp="http://sailpoint.com/ui"
  xmlns:t="http://myfaces.apache.org/tomahawk" xmlns:ui="http://java.sun.com/jsf/facelets">

<body>

  <ui:composition>
    <app-root style="background:#ffffff; top: 100px !important; height: 100%;  bottom: 0 !important;"></app-root>
    <script src="#{plugins.requestContextPath}/plugin/#{plugins.pluginName}/ui/js/runtime.js"></script>
    <script src="#{plugins.requestContextPath}/plugin/#{plugins.pluginName}/ui/js/polyfills.js"></script>
    <script src="#{plugins.requestContextPath}/plugin/#{plugins.pluginName}/ui/js/main.js"></script>
    <link href="#{plugins.requestContextPath}/plugin/#{plugins.pluginName}/ui/css/styles.css" rel="stylesheet"></link>
  </ui:composition>
</body>

</html>
```

>[!Note]
> When using ant, adjust accordingly

-   Add the App javascript files to the `plugin-files.xml` config.

```xml
<fileSet>
    <directory>${project.basedir}/pluginapp/dist/pluginapp</directory>
    <outputDirectory>${file.separator}/ui/js</outputDirectory>
    <includes>
        <include>*.js</include>
    </includes>
</fileSet>
```

-   Add the `npm build` step to the maven process. In `pom.xml`:

```xml
            <!-- Builds angular app-->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.2.0</version>
                <executions>
                    <execution>
                        <id>npm run build (compile)</id>
                        <goals>
                            <goal>exec</goal>
                        </goals>
                        <phase>compile</phase>
                        <configuration>
                            <executable>npm</executable>
                            <workingDirectory>pluginapp</workingDirectory>
                            <arguments>
                                <argument>run</argument>
                                <argument>build</argument>
                            </arguments>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
```

-   To test, compile plugin, and install. You should see the Angular boilerplate app as the plugin.

```sh
mvn clean package
```

#### Proxy Setup

-   To avoid CORS issues :
    -   [Cross-origin resource sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors)
-   Create proxy.conf.json

```json
{
  "/identityiq": {
    "target": "http://localhost:8181",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

-   Add to angular.json, under `projects.pluginapp.architect.serve.configurations.development`

```json
"development": {
  "browserTarget": "pluginapp:build:development",
  "proxyConfig": "proxy.conf.json"
}
```

### Code!!

From here on, you should be good to develop your Angular app, and it should look and act the same inside the IIQ plugin framework.

Happy coding!!