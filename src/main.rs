use std::{env, fs, io};

fn main() -> io::Result<()> {
    println!("Calling fs::read_dir");
    for entry in fs::read_dir(env::current_dir()?)? {
        let entry = entry?;
        println!("Entry {}", entry.path().display());
    }
    Ok(())
}
