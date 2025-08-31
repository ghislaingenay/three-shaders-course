function launch(file: string) {
  import(`./shaders/${file}/${file}.ts`).then((module) => {
    module.default();
  });
}

launch("sliced_model");
